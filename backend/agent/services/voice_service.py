from fastapi import WebSocket, WebSocketDisconnect
from elevenlabs import VoiceSettings
from elevenlabs.client import ElevenLabs
from typing import Dict, Any
from dotenv import load_dotenv
import os
import json
from typing import IO
from io import BytesIO

load_dotenv()

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
elevenlabs = ElevenLabs(
    api_key=ELEVENLABS_API_KEY,
)

def yield_text():
    yield "Yo how are you"
    yield "I am your voice assistant."

class VoiceService:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
    
    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_connections[client_id] = websocket
    
    def disconnect(self, client_id: str):
        if client_id in self.active_connections:
            del self.active_connections[client_id]
    
    async def handle_audio_stream(self, websocket: WebSocket, client_id: str):
        """Handle incoming audio stream from client."""

        response = elevenlabs.text_to_speech.stream(
        voice_id="pNInz6obpgDQGcFmaJgB", # Adam pre-made voice
        output_format="mp3_22050_32",
        text=yield_text(),
        model_id="eleven_multilingual_v2",
        # Optional voice settings that allow you to customize the output
        voice_settings=VoiceSettings(
            stability=0.0,
            similarity_boost=1.0,
            style=0.0,
            use_speaker_boost=True,
            speed=1.0,
        ),
    )
        # Create a BytesIO object to hold the audio data in memory
        audio_stream = BytesIO()
        # Write each chunk of audio data to the stream
        for chunk in response:
            if chunk:
                audio_stream.write(chunk)
        # Reset stream position to the beginning
        audio_stream.seek(0)
        # Return the stream for further use
        return audio_stream




        # try:
        #     while True:
        #         data = await websocket.receive_bytes()
        #         # TODO: Process audio with STT
        #         # TODO: Send to LLM
        #         # TODO: Convert response to speech with TTS
        #         # For now, just echo back
        #         await websocket.send_json({"type": "processing", "message": "Audio received"})
        # except WebSocketDisconnect:
        #     self.disconnect(client_id)

voice_service = VoiceService()
