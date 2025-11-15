"""
API wrapper for ElderSphere Agent.
Provides a simple interface for frontend integration with voice support.
"""

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, StreamingResponse
from pydantic import BaseModel
from typing import Dict, Any, Optional
from agent import ElderSphereAgent
import os
from dotenv import load_dotenv
from elevenlabs import ElevenLabs
from elevenlabs.client import ElevenLabs as ElevenLabsClient

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="ElderSphere Companion Agent API",
    description="AI companion/psychotherapist for elderly wellbeing",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize agent (singleton pattern)
agent = None
elevenlabs_client = None


def get_agent():
    """Get or create the agent instance."""
    global agent
    if agent is None:
        agent = ElderSphereAgent()
    return agent


def get_elevenlabs_client():
    """Get or create the ElevenLabs client instance."""
    global elevenlabs_client
    if elevenlabs_client is None:
        api_key = os.getenv('ELEVENLABS_API_KEY')
        if not api_key:
            raise ValueError("ELEVENLABS_API_KEY not found in environment variables")
        elevenlabs_client = ElevenLabsClient(api_key=api_key)
    return elevenlabs_client


# Pydantic models for request/response validation
class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str
    success: bool


class PersonalityResponse(BaseModel):
    personality: Dict[str, Any]
    success: bool


class MessageResponse(BaseModel):
    message: str
    success: bool


class GreetingResponse(BaseModel):
    greeting: str
    success: bool


class HealthResponse(BaseModel):
    status: str
    service: str


class VoiceChatResponse(BaseModel):
    response: str
    success: bool
    audio_available: bool


@app.get('/health', response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    return {
        'status': 'healthy',
        'service': 'ElderSphere Companion Agent'
    }


@app.post('/chat', response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Chat endpoint.
    
    Send a message to the agent and receive a response.
    The agent will automatically extract and store personality insights.
    """
    try:
        if not request.message.strip():
            raise HTTPException(status_code=400, detail='Message cannot be empty')
        
        # Get agent response
        agent_instance = get_agent()
        response = agent_instance.chat(request.message)
        
        return {
            'response': response,
            'success': True
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get('/personality', response_model=PersonalityResponse)
async def get_personality():
    """
    Get the current personality profile.
    
    Returns all learned personality traits, interests, and preferences.
    """
    try:
        agent_instance = get_agent()
        personality = agent_instance.get_personality_profile()
        
        return {
            'personality': personality,
            'success': True
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post('/reset', response_model=MessageResponse)
async def reset_conversation():
    """
    Reset conversation history (keeps personality data).
    
    Clears the chat history while preserving learned personality information.
    """
    try:
        agent_instance = get_agent()
        agent_instance.reset_conversation()
        
        return {
            'message': 'Conversation history reset',
            'success': True
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post('/reset-all', response_model=MessageResponse)
async def reset_all():
    """
    Reset both conversation and personality data.
    
    Completely clears all data including personality information.
    """
    try:
        agent_instance = get_agent()
        agent_instance.reset_all()
        
        return {
            'message': 'All data reset',
            'success': True
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get('/greeting', response_model=GreetingResponse)
async def get_greeting():
    """
    Get an initial greeting from the agent.
    
    Returns a warm, contextual greeting to start the conversation.
    """
    try:
        agent_instance = get_agent()
        # Generate a contextual greeting
        greeting = agent_instance.chat("Hello")
        
        return {
            'greeting': greeting,
            'success': True
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post('/voice-chat', response_model=VoiceChatResponse)
async def voice_chat(audio: UploadFile = File(...)):
    """
    Voice chat endpoint.
    
    Upload an audio file, get transcription and agent's text response.
    Use /voice-chat-audio for the audio response.
    """
    try:
        # Read audio file
        audio_bytes = await audio.read()
        
        # Transcribe audio using ElevenLabs
        client = get_elevenlabs_client()
        
        # Use the correct parameter name: 'file' not 'audio'
        result = client.speech_to_text.convert(
            file=audio_bytes,
            model_id="scribe_v1"
        )
        
        # Extract text from result
        user_message = result.text if hasattr(result, 'text') else str(result)
        
        if not user_message.strip():
            raise HTTPException(status_code=400, detail='Could not transcribe audio')
        
        # Get agent response
        agent_instance = get_agent()
        response = agent_instance.chat(user_message)
        
        return {
            'response': response,
            'success': True,
            'audio_available': True
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Voice chat error: {str(e)}")


@app.post('/voice-chat-with-audio')
async def voice_chat_with_audio(audio: UploadFile = File(...), voice_id: Optional[str] = "21m00Tcm4TlvDq8ikWAM"):
    """
    Voice chat endpoint with audio response.
    
    Upload an audio file, get agent's response as audio.
    Returns audio/mpeg stream.
    """
    try:
        # Read audio file
        audio_bytes = await audio.read()
        
        # Transcribe audio using ElevenLabs
        client = get_elevenlabs_client()
        
        # Send audio directly to ElevenLabs (no conversion needed)
        result = client.speech_to_text.convert(
            file=audio_bytes,
            model_id='scribe_v1',
            file_format='other'  # Let ElevenLabs auto-detect the format
        )
        
        # Extract text from result
        user_message = result.text if hasattr(result, 'text') else str(result)
        
        if not user_message.strip():
            raise HTTPException(status_code=400, detail='Could not transcribe audio')
        
        # Get agent response
        agent_instance = get_agent()
        response_text = agent_instance.chat(user_message)
        
        # Convert response to speech
        audio_response = client.text_to_speech.convert(
            voice_id=voice_id,
            text=response_text,
            model_id="eleven_multilingual_v2"
        )
        
        # Stream audio response
        def audio_stream():
            for chunk in audio_response:
                yield chunk
        
        # Encode header values to handle special characters
        # HTTP headers must be Latin-1, so we use URL encoding for Unicode text
        import urllib.parse
        encoded_response_text = urllib.parse.quote(response_text)
        encoded_user_message = urllib.parse.quote(user_message)
        
        return StreamingResponse(
            audio_stream(),
            media_type="audio/mpeg",
            headers={
                "Content-Disposition": "attachment; filename=response.mp3",
                "X-Response-Text": encoded_response_text,
                "X-User-Message": encoded_user_message
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Voice chat with audio error: {str(e)}")


@app.post('/text-to-speech')
async def text_to_speech(request: ChatRequest, voice_id: Optional[str] = "21m00Tcm4TlvDq8ikWAM"):
    """
    Convert text to speech.
    
    Converts the provided text to speech audio using ElevenLabs.
    """
    try:
        if not request.message.strip():
            raise HTTPException(status_code=400, detail='Message cannot be empty')
        
        client = get_elevenlabs_client()
        
        # Convert text to speech
        audio_response = client.text_to_speech.convert(
            voice_id=voice_id,
            text=request.message,
            model_id="eleven_multilingual_v2"
        )
        
        # Stream audio response
        def audio_stream():
            for chunk in audio_response:
                yield chunk
        
        return StreamingResponse(
            audio_stream(),
            media_type="audio/mpeg",
            headers={"Content-Disposition": "attachment; filename=speech.mp3"}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get('/voices')
async def get_voices():
    """
    Get available ElevenLabs voices.
    
    Returns a list of available voice IDs and names.
    """
    try:
        client = get_elevenlabs_client()
        voices = client.voices.get_all()
        
        voice_list = [
            {
                "voice_id": voice.voice_id,
                "name": voice.name,
                "category": voice.category if hasattr(voice, 'category') else None,
                "description": voice.description if hasattr(voice, 'description') else None
            }
            for voice in voices.voices
        ]
        
        return {
            'voices': voice_list,
            'success': True
        }
        
    except Exception as e:
        # Fallback to hardcoded voices if API fails
        hardcoded_voices = [
            {"voice_id": "21m00Tcm4TlvDq8ikWAM", "name": "Rachel", "description": "Calm, balanced"},
            {"voice_id": "AZnzlk1XvdvUeBnXmlld", "name": "Domi", "description": "Strong, confident"},
            {"voice_id": "EXAVITQu4vr4xnSDxMaL", "name": "Sarah", "description": "Soft, gentle"},
            {"voice_id": "ErXwobaYiN019PkySvjV", "name": "Antoni", "description": "Well-rounded"},
        ]
        
        return {
            'voices': hardcoded_voices,
            'success': True,
            'note': f'Using fallback voices: {str(e)}'
        }


if __name__ == '__main__':
    import uvicorn
    
    # Check for API key
    if not os.getenv('GOOGLE_API_KEY'):
        print("Error: GOOGLE_API_KEY not found in environment variables")
        print("Please create a .env file with your Google API key")
        exit(1)
    
    # Run the server
    print("Starting ElderSphere Agent API Server (FastAPI)...")
    print("Server running on http://localhost:8000")
    print("\nAvailable endpoints:")
    print("  GET  /health - Health check")
    print("  POST /chat - Send a message (text)")
    print("  POST /voice-chat - Send audio, get text response")
    print("  POST /voice-chat-with-audio - Send audio, get audio response")
    print("  POST /text-to-speech - Convert text to speech")
    print("  GET  /voices - Get available ElevenLabs voices")
    print("  GET  /personality - Get personality profile")
    print("  POST /reset - Reset conversation")
    print("  POST /reset-all - Reset everything")
    print("  GET  /greeting - Get initial greeting")
    print("  GET  /docs - Interactive API documentation (Swagger UI)")
    print("  GET  /redoc - Alternative API documentation")
    print("\nPress Ctrl+C to stop the server\n")
    
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
