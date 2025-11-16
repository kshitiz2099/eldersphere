import socketio
from elevenlabs.client import ElevenLabs
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Socket.IO server
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins='*'
)
sio_app = socketio.ASGIApp(sio)

# Initialize ElevenLabs client
client = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))

@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")

@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")

@sio.event
async def audio_chunk(sid, data):
    """Receive audio chunk and transcribe using ElevenLabs"""
    try:
        # data should be bytes
        # audio_bytes = data if isinstance(data, bytes) else bytes(data)
        
        # Transcribe using ElevenLabs
        # transcription = client.audio_native.transcribe(audio=audio_bytes)
        print("Starting transcription...")
        transcription = client.speech_to_text.convert(
            file = data,
            model_id = "scribe_v1",
            language_code = "eng"
        )
        print(f"Transcription result: {transcription}")
        # Send transcription back to client
        await sio.emit('transcription', {'text': transcription}, room=sid)
        
    except Exception as e:
        print(f"Transcription error: {e}")
        await sio.emit('error', {'message': str(e)}, room=sid)
