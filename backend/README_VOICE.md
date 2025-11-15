# ElderSphere Voice Pipeline Test

A complete real-time voice bot implementation with React frontend and FastAPI backend.

## Architecture

**Frontend (React + TypeScript)**
- Audio capture using RecordRTC
- WebSocket streaming via Socket.IO
- Mock mode for testing without backend

**Backend (FastAPI + Python)**
- WebSocket endpoint for real-time audio streaming
- STT: ElevenLabs (fallback to OpenAI Whisper)
- LLM: OpenAI GPT-3.5-turbo
- TTS: ElevenLabs
- Mock mode for testing without API keys

## Setup

### Backend

1. Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

2. Create `.env` file:
```bash
cp .env.example .env
# Edit .env and add your API keys
```

3. For testing with mock mode (no API keys needed):
```bash
# Keep USE_MOCK=true in .env
python main.py
```

4. For production with real APIs:
```bash
# Set USE_MOCK=false in .env and add API keys
python main.py
```

### Frontend

1. Install dependencies:
```bash
cd app
npm install socket.io-client recordrtc
```

2. Import and use the voice service:
```typescript
import { createVoiceService } from './services/voiceService';

// Create service with mock mode for testing
const voiceService = createVoiceService({
  backendUrl: 'http://localhost:8000',
  useMock: true, // Set to false to use real backend
  onTranscript: (text, isFinal) => {
    console.log('Transcript:', text, isFinal ? '(final)' : '(partial)');
  },
  onResponse: (text) => {
    console.log('LLM Response:', text);
  },
  onStatusChange: (status) => {
    console.log('Status:', status);
  }
});

// Initialize and use
await voiceService.initialize();
await voiceService.startListening();
// ... user speaks ...
await voiceService.stopListening();
```

## API Endpoints

### HTTP
- `GET /` - API root
- `GET /health` - Health check
- `POST /api/test/write` - Test MongoDB write

### WebSocket (Socket.IO)
- `connect` - Connect to voice service
- `audio_chunk` - Send audio chunk
- `audio_end` - End audio stream
- `text_message` - Send text-only message
- `transcript` - Receive transcription
- `llm_response` - Receive LLM response
- `audio_response` - Receive TTS audio

## Testing the Pipeline

### Test with Mock Mode (No API Keys)

**Frontend:**
```typescript
const voiceService = createVoiceService({
  useMock: true,
  onTranscript: (text, isFinal) => console.log('📝', text),
  onResponse: (text) => console.log('🤖', text),
  onStatusChange: (status) => console.log('🔄', status),
});

await voiceService.initialize();
await voiceService.startListening();
// Simulates: "Hello, how are you today?" -> "I'm doing great! Thank you..."
await voiceService.stopListening();
```

**Backend:**
```bash
# Make sure USE_MOCK=true in .env
python main.py
# Server runs with mock responses
```

### Test with Real APIs

1. Get API keys:
   - OpenAI: https://platform.openai.com/api-keys
   - ElevenLabs: https://elevenlabs.io/app/settings/api-keys

2. Update `.env`:
```bash
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=...
USE_MOCK=false
```

3. Run backend:
```bash
python main.py
```

4. Update frontend:
```typescript
const voiceService = createVoiceService({
  backendUrl: 'http://localhost:8000',
  useMock: false,
  // ... callbacks
});
```

## Voice Pipeline Flow

1. **User speaks** → Frontend captures audio (RecordRTC)
2. **Audio chunks** → Streamed via WebSocket to backend
3. **STT** → ElevenLabs/Whisper transcribes audio
4. **LLM** → OpenAI generates response
5. **TTS** → ElevenLabs converts text to speech
6. **Audio response** → Streamed back to frontend
7. **Playback** → Frontend plays audio response

## Notes

- Audio format: 16kHz, mono, WebM
- Chunk size: 250ms for real-time feel
- Latency: ~150-400ms total
- Mock mode simulates the full pipeline without API calls
- MongoDB test endpoint available at `/api/test/write`
