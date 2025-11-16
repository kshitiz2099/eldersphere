"""
API wrapper for ElderSphere Agent.
Provides a simple interface for frontend integration with voice support.
"""

from fastapi import FastAPI, HTTPException, UploadFile, File, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, StreamingResponse
from pydantic import BaseModel
from typing import Dict, Any, Optional
from agent import ElderSphereAgent
import os
from dotenv import load_dotenv
from elevenlabs import ElevenLabs
from elevenlabs.client import ElevenLabs as ElevenLabsClient
from repository.mongo_repository import MongoRepository
from services.user_service import get_user_name_by_id, get_user_groups, get_group_chats_with_names, add_message_to_group
from services.voice_service import voice_service
import traceback
# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="ElderSphere Companion Agent API",
    description="AI companion/psychotherapist for elderly wellbeing",
    version="1.0.0"
)

# Initialize database
mongo_repo = MongoRepository()
mongo_repo.initialize_from_files(
    users_file=os.path.join(os.path.dirname(__file__), '..', 'users_data.json'),
    groups_file=os.path.join(os.path.dirname(__file__), '..', 'groups_data.json'),
    chats_file=os.path.join(os.path.dirname(__file__), '..', 'chats_data.json')
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
        print("[DEBUG] ElevenLabs client initialized")
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


class UserNameResponse(BaseModel):
    user_id: int
    name: str
    success: bool


class UserGroupsResponse(BaseModel):
    user_id: int
    groups: list
    success: bool


class GroupChatsResponse(BaseModel):
    group_id: int
    chats: list
    success: bool


class AddMessageRequest(BaseModel):
    id: int
    sender: int
    senderName: str
    text: str
    timestamp: str


class AddMessageResponse(BaseModel):
    success: bool
    message: str


@app.get('/user/{user_id}/name', response_model=UserNameResponse)
async def get_user_name(user_id: int):
    """Get user name by ID."""
    name = get_user_name_by_id(user_id)
    return {
        'user_id': user_id,
        'name': name,
        'success': bool(name)
    }


@app.get('/user/{user_id}/groups', response_model=UserGroupsResponse)
async def get_user_groups_endpoint(user_id: int):
    """Get all groups for a user."""
    groups = get_user_groups(user_id)
    return {
        'user_id': user_id,
        'groups': groups,
        'success': True
    }


@app.get('/group/{group_id}/chats', response_model=GroupChatsResponse)
async def get_group_chats_endpoint(group_id: int):
    """Get all chats for a group with user names."""
    chats = get_group_chats_with_names(group_id)
    return {
        'group_id': group_id,
        'chats': chats,
        'success': True
    }


@app.post('/group/{group_id}/message', response_model=AddMessageResponse)
async def add_message_endpoint(group_id: int, request: AddMessageRequest):
    """Add a new message to a group chat."""
    message = {
        'id': request.id,
        'sender': request.sender,
        'senderName': request.senderName,
        'text': request.text,
        'timestamp': request.timestamp
    }
    success = add_message_to_group(group_id, message)
    return {
        'success': success,
        'message': 'Message added successfully' if success else 'Failed to add message'
    }


@app.websocket("/ws/voice")
async def voice_websocket(websocket: WebSocket):
    """WebSocket endpoint for real-time voice communication (STT-LLM-TTS)."""
    client_id = f"client_{id(websocket)}"
    await voice_service.connect(websocket, client_id)
    try:
        await voice_service.handle_audio_stream(websocket, client_id)
    except WebSocketDisconnect:
        voice_service.disconnect(client_id)


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
        print(f"[DEBUG] /voice-chat received audio bytes length: {len(audio_bytes)}")
        if not audio_bytes:
            raise HTTPException(status_code=400, detail="Uploaded audio file is empty. Check client recording settings and mime type.")
        
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
        print("[ERROR] Exception in /voice-chat:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Voice chat error: {str(e)}")


@app.websocket("/ws/voice-chat-with-audio")
async def voice_chat_with_audio_ws(websocket: WebSocket):
    """
    WebSocket voice chat endpoint with audio response.
    
    Client sends audio bytes, receives transcription, text response, and audio response.
    Connection opens and closes based on client requests.
    """
    await websocket.accept()
    
    try:
        # Receive audio bytes from client
        audio_bytes = await websocket.receive_bytes()
        print(f"[DEBUG] WebSocket received audio bytes length: {len(audio_bytes)}")
        
        if not audio_bytes:
            await websocket.send_json({"type": "error", "message": "No audio data received"})
            await websocket.close()
            return
        
        # Transcribe audio using ElevenLabs
        client = get_elevenlabs_client()
        
        result = client.speech_to_text.convert(
            file=audio_bytes,
            model_id='scribe_v1',
            file_format='other'  # Let ElevenLabs auto-detect the format
        )
        
        # Extract text from result
        user_message = result.text if hasattr(result, 'text') else str(result)
        
        if not user_message.strip():
            await websocket.send_json({"type": "error", "message": "Could not transcribe audio"})
            await websocket.close()
            return
        
        # Send transcription to client
        await websocket.send_json({"type": "transcription", "text": user_message})
        
        # Get agent response
        agent_instance = get_agent()
        response_text = agent_instance.chat(user_message)
        
        # Send text response to client
        await websocket.send_json({"type": "response", "text": response_text})
        
        # Convert response to speech
        audio_response = client.text_to_speech.convert(
            voice_id="21m00Tcm4TlvDq8ikWAM",
            text=response_text,
            model_id="eleven_multilingual_v2"
        )
        
        # Stream audio response to client
        for chunk in audio_response:
            if chunk:
                await websocket.send_bytes(chunk)
        
        # Send completion signal
        await websocket.send_json({"type": "complete"})
        await websocket.close()
        
    except WebSocketDisconnect:
        print("[DEBUG] WebSocket disconnected")
    except Exception as e:
        print("[ERROR] Exception in WebSocket voice-chat-with-audio:")
        traceback.print_exc()
        try:
            await websocket.send_json({"type": "error", "message": str(e)})
            await websocket.close()
        except:
            pass


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
