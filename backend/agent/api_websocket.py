"""
WebSocket-based API for ElderSphere Agent with ULTRA-LOW LATENCY.
Uses ElevenLabs WebSocket endpoint for bidirectional streaming.
"""

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from agent import ElderSphereAgent
import os
import time
import json
import asyncio
import tempfile
import base64
import websockets
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="ElderSphere WebSocket API",
    description="Ultra-low latency AI companion with WebSocket streaming",
    version="2.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize agent (singleton)
agent = None

def get_agent():
    """Get or create the agent instance."""
    global agent
    if agent is None:
        agent = ElderSphereAgent()
    return agent


class HealthResponse(BaseModel):
    status: str
    service: str


@app.get('/health', response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    return {
        'status': 'healthy',
        'service': 'ElderSphere WebSocket API'
    }


@app.websocket("/ws/voice-chat")
async def websocket_voice_chat(websocket: WebSocket, voice_id: Optional[str] = "21m00Tcm4TlvDq8ikWAM"):
    """
    WebSocket endpoint for ULTRA-LOW LATENCY voice chat.
    
    Flow:
    1. Client sends audio chunks (WebM/MP3/etc)
    2. Server transcribes with ElevenLabs STT
    3. LLM streams response tokens
    4. Each token/chunk sent to ElevenLabs WebSocket TTS
    5. Audio chunks streamed back to client IMMEDIATELY
    
    This achieves TRUE end-to-end streaming with minimal latency!
    """
    await websocket.accept()
    
    try:
        elevenlabs_api_key = os.getenv('ELEVENLABS_API_KEY')
        if not elevenlabs_api_key:
            await websocket.send_json({"error": "ELEVENLABS_API_KEY not configured"})
            await websocket.close()
            return
        
        agent_instance = get_agent()
        
        # ElevenLabs WebSocket TTS URL
        elevenlabs_ws_url = f"wss://api.elevenlabs.io/v1/text-to-speech/{voice_id}/stream-input?model_id=eleven_flash_v2_5&optimize_streaming_latency=4&output_format=mp3_22050_32"
        
        while True:
            # Receive audio from client
            message = await websocket.receive()
            
            if "bytes" in message:
                # Audio data received
                audio_bytes = message["bytes"]
                
                # Send status update
                await websocket.send_json({
                    "type": "status",
                    "message": "Processing audio...",
                    "timestamp": time.time()
                })
                
                # Step 1: Transcribe with ElevenLabs STT
                from elevenlabs import ElevenLabs, VoiceSettings
                client = ElevenLabs(api_key=elevenlabs_api_key)
                
                # Save audio to temporary file for debugging
                import tempfile
                with tempfile.NamedTemporaryFile(suffix='.webm', delete=False) as tmp:
                    tmp.write(audio_bytes)
                    tmp_path = tmp.name
                
                stt_start = time.time()
                try:
                    # Read the file and send to STT
                    with open(tmp_path, 'rb') as audio_file:
                        result = client.speech_to_text.convert(
                            file=audio_file.read(),
                            model_id='scribe_v1',
                            file_format='other'
                        )
                    
                    user_message = result.text if hasattr(result, 'text') else str(result)
                    stt_time = int((time.time() - stt_start) * 1000)
                except Exception as e:
                    await websocket.send_json({
                        "type": "error",
                        "message": f"STT error: {str(e)}"
                    })
                    os.unlink(tmp_path)
                    continue
                finally:
                    if os.path.exists(tmp_path):
                        os.unlink(tmp_path)
                
                # Send transcription
                await websocket.send_json({
                    "type": "transcription",
                    "text": user_message,
                    "latency_ms": stt_time
                })
                
                if not user_message.strip():
                    await websocket.send_json({"type": "error", "message": "Could not transcribe audio"})
                    continue
                
                # Step 2: Connect to ElevenLabs WebSocket TTS (following official guide)
                llm_start = time.time()
                
                # WebSocket URL as per ElevenLabs guide
                tts_uri = f"wss://api.elevenlabs.io/v1/text-to-speech/{voice_id}/stream-input?model_id=eleven_flash_v2_5"
                
                try:
                    # Connect to ElevenLabs WebSocket with API key in headers
                    async with websockets.connect(
                        tts_uri,
                        additional_headers={"xi-api-key": elevenlabs_api_key}
                    ) as tts_ws:
                        
                        # Initialize connection with voice settings (per guide)
                        await tts_ws.send(json.dumps({
                            "text": " ",  # Initial space to start
                            "voice_settings": {
                                "stability": 0.1,
                                "similarity_boost": 0.8,
                                "use_speaker_boost": True
                            },
                            "generation_config": {
                                "chunk_length_schedule": [50, 90, 120, 150]  # Aggressive chunking for low latency
                            }
                        }))
                        
                        # Stream LLM tokens to TTS
                        async def stream_llm_to_tts():
                            """Send LLM tokens to ElevenLabs WebSocket"""
                            first_token = True
                            word_count = 0
                            chunk_buffer = ""
                            
                            for text_chunk in agent_instance.chat_stream(user_message):
                                if first_token:
                                    first_token_time = int((time.time() - llm_start) * 1000)
                                    await websocket.send_json({
                                        "type": "first_token",
                                        "latency_ms": first_token_time
                                    })
                                    first_token = False
                                
                                chunk_buffer += text_chunk
                                
                                # Count words
                                if ' ' in text_chunk or ',' in text_chunk:
                                    word_count += 1
                                
                                # Send every 5-7 words or at sentence boundaries
                                should_flush = (
                                    word_count >= 5 or
                                    any(delim in text_chunk for delim in ['.', '!', '?', '\n'])
                                )
                                
                                if should_flush and chunk_buffer.strip():
                                    # Send to ElevenLabs WebSocket
                                    await tts_ws.send(json.dumps({
                                        "text": chunk_buffer,
                                        "try_trigger_generation": True
                                    }))
                                    chunk_buffer = ""
                                    word_count = 0
                            
                            # Send remaining text with flush
                            if chunk_buffer.strip():
                                await tts_ws.send(json.dumps({
                                    "text": chunk_buffer,
                                    "flush": True  # Force generation
                                }))
                            
                            # Close WebSocket by sending empty string (per guide)
                            await tts_ws.send(json.dumps({"text": ""}))
                        
                        # Receive and forward audio chunks
                        async def stream_audio_to_client():
                            """Receive audio from ElevenLabs and send to client"""
                            first_audio = True
                            full_response = []
                            
                            while True:
                                try:
                                    message = await tts_ws.recv()
                                    data = json.loads(message)
                                    
                                    if data.get("audio"):
                                        # Decode base64 audio (per guide)
                                        audio_chunk = base64.b64decode(data["audio"])
                                        
                                        if first_audio:
                                            first_audio_time = int((time.time() - llm_start) * 1000)
                                            await websocket.send_json({
                                                "type": "first_audio",
                                                "latency_ms": first_audio_time
                                            })
                                            first_audio = False
                                        
                                        # Send binary audio to client
                                        await websocket.send_bytes(audio_chunk)
                                    
                                    # Track response text if available
                                    if data.get("normalizedAlignment"):
                                        chars = data["normalizedAlignment"].get("chars", [])
                                        full_response.extend([c for c in chars])
                                    
                                    # Check for completion
                                    if data.get("isFinal"):
                                        break
                                
                                except websockets.exceptions.ConnectionClosed:
                                    break
                            
                            return "".join(full_response) if full_response else ""
                        
                        # Run both tasks concurrently
                        response_text, _ = await asyncio.gather(
                            stream_audio_to_client(),
                            stream_llm_to_tts()
                        )
                        
                        # Send completion
                        await websocket.send_json({
                            "type": "complete",
                            "response_text": response_text or "Response completed"
                        })
                
                except Exception as e:
                    print(f"WebSocket TTS error: {str(e)}")
                    await websocket.send_json({
                        "type": "error",
                        "message": f"TTS error: {str(e)}"
                    })
            
            elif "text" in message:
                # Text message received (could be control messages)
                text_data = message["text"]
                data = json.loads(text_data)
                
                if data.get("type") == "ping":
                    await websocket.send_json({"type": "pong"})
                
    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"WebSocket error: {str(e)}")
        try:
            await websocket.send_json({
                "type": "error",
                "message": str(e)
            })
        except:
            pass
    finally:
        try:
            await websocket.close()
        except:
            pass


if __name__ == '__main__':
    import uvicorn
    
    # Check for API keys
    if not os.getenv('GOOGLE_API_KEY'):
        print("Error: GOOGLE_API_KEY not found")
        exit(1)
    
    if not os.getenv('ELEVENLABS_API_KEY'):
        print("Error: ELEVENLABS_API_KEY not found")
        exit(1)
    
    print("🚀 Starting ElderSphere WebSocket API Server...")
    print("📡 WebSocket endpoint: ws://localhost:8000/ws/voice-chat")
    print("🏥 Health check: http://localhost:8000/health")
    print("\n⚡ ULTRA-LOW LATENCY MODE ENABLED ⚡")
    print("   • ElevenLabs WebSocket TTS")
    print("   • Flash v2.5 model (75ms inference)")
    print("   • Bidirectional streaming")
    print("   • Expected TTFB: 150-200ms\n")
    
    uvicorn.run("api_websocket:app", host="0.0.0.0", port=8000, reload=False)
