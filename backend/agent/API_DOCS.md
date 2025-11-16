# Narrio Agent API Documentation

RESTful API for the Narrio Companion Agent with voice capabilities powered by ElevenLabs.

## Base URL
```
http://localhost:8000
```

## Running the API Server

```bash
source venv/bin/activate
python api.py
```

The API will be available at:
- API: http://localhost:8000
- Interactive API docs (Swagger): http://localhost:8000/docs
- Alternative API docs (ReDoc): http://localhost:8000/redoc

## Endpoints

### 1. Health Check
Check if the API server is running.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "healthy",
  "service": "Narrio Companion Agent"
}
```

**Example:**
```bash
curl http://localhost:8000/health
```

---

### 2. Chat
Send a message to the agent and receive a response.

**Endpoint:** `POST /chat`

**Request Body:**
```json
{
  "message": "Hello, I love gardening!"
}
```

**Response:**
```json
{
  "response": "That's wonderful! Gardening is such a rewarding hobby...",
  "success": true
}
```

**Error Response:**
```json
{
  "detail": "Missing message in request body"
}
```

**Example:**
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "I love gardening!"}'
```

---

### 3. Get Personality Profile
Retrieve the learned personality traits.

**Endpoint:** `GET /personality`

**Response:**
```json
{
  "personality": {
    "hobbies": ["gardening", "reading"],
    "family_details": "Has two grandchildren",
    "emotional_traits": "Optimistic, sometimes feels lonely"
  },
  "success": true
}
```

**Example:**
```bash
curl http://localhost:8000/personality
```

---

### 4. Reset Conversation
Clear conversation history while keeping personality data.

**Endpoint:** `POST /reset`

**Response:**
```json
{
  "message": "Conversation history reset",
  "success": true
}
```

**Example:**
```bash
curl -X POST http://localhost:8000/reset
```

---

### 5. Reset All
Clear both conversation history and personality data.

**Endpoint:** `POST /reset-all`

**Response:**
```json
{
  "message": "All data reset",
  "success": true
}
```

**Example:**
```bash
curl -X POST http://localhost:8000/reset-all
```

---

### 6. Get Greeting
Get an initial greeting from the agent.

**Endpoint:** `GET /greeting`

**Response:**
```json
{
  "greeting": "Hello! I'm so glad to spend time with you today. How are you feeling?",
  "success": true
}
```

**Example:**
```bash
curl http://localhost:8000/greeting
```

---

### 7. Voice Chat (Text Response)
Upload audio and receive a text response.

**Endpoint:** `POST /voice-chat`

**Request:**
- Multipart form data with audio file

**Parameters:**
- `audio` (file): Audio file (WebM, MP4, MP3, WAV, etc.)

**Response:**
```json
{
  "user_message": "Hello, how are you?",
  "response": "I'm doing well, thank you for asking! How are you feeling today?",
  "success": true
}
```

**Example:**
```bash
curl -X POST http://localhost:8000/voice-chat \
  -F "audio=@recording.webm"
```

---

### 8. Voice Chat (Audio Response)
Upload audio and receive an audio response.

**Endpoint:** `POST /voice-chat-with-audio`

**Request:**
- Multipart form data with audio file

**Parameters:**
- `audio` (file): Audio file (WebM, MP4, MP3, WAV, etc.)
- `voice_id` (optional, query parameter): ElevenLabs voice ID (default: "21m00Tcm4TlvDq8ikWAM" - Rachel)

**Response:**
- Audio stream (MP3 format)
- Headers:
  - `X-Response-Text`: URL-encoded response text
  - `X-User-Message`: URL-encoded transcribed user message

**Example:**
```bash
curl -X POST "http://localhost:8000/voice-chat-with-audio?voice_id=21m00Tcm4TlvDq8ikWAM" \
  -F "audio=@recording.webm" \
  -o response.mp3
```

**JavaScript Example:**
```javascript
const formData = new FormData();
formData.append('audio', audioBlob, 'recording.webm');

const response = await fetch('http://localhost:8000/voice-chat-with-audio?voice_id=21m00Tcm4TlvDq8ikWAM', {
  method: 'POST',
  body: formData
});

const audioBlob = await response.blob();
const responseText = decodeURIComponent(response.headers.get('X-Response-Text'));
const userMessage = decodeURIComponent(response.headers.get('X-User-Message'));

// Play audio
const audio = new Audio(URL.createObjectURL(audioBlob));
audio.play();
```

---

### 9. Text to Speech
Convert text to speech using ElevenLabs.

**Endpoint:** `POST /text-to-speech`

**Request Body:**
```json
{
  "text": "Hello, how are you today?",
  "voice_id": "21m00Tcm4TlvDq8ikWAM"
}
```

**Parameters:**
- `text` (required): Text to convert to speech
- `voice_id` (optional): ElevenLabs voice ID (default: "21m00Tcm4TlvDq8ikWAM")

**Response:**
- Audio stream (MP3 format)

**Example:**
```bash
curl -X POST http://localhost:8000/text-to-speech \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, how are you?", "voice_id": "21m00Tcm4TlvDq8ikWAM"}' \
  -o output.mp3
```

---

### 10. Get Available Voices
List all available ElevenLabs voices.

**Endpoint:** `GET /voices`

**Response:**
```json
{
  "voices": [
    {
      "voice_id": "21m00Tcm4TlvDq8ikWAM",
      "name": "Rachel",
      "category": "premade"
    },
    {
      "voice_id": "AZnzlk1XvdvUeBnXmlld",
      "name": "Domi",
      "category": "premade"
    }
  ],
  "success": true
}
```

**Example:**
```bash
curl http://localhost:8000/voices
```

---

## Voice Integration

### Supported Audio Formats
The API accepts various audio formats through ElevenLabs' auto-detection:
- WebM (browser recording)
- MP4/M4A (Safari/iOS recording)
- MP3
- WAV
- OGG
- FLAC

### Available Voices
Default voices include:
- **Rachel** (21m00Tcm4TlvDq8ikWAM) - Default, warm female voice
- **Domi** (AZnzlk1XvdvUeBnXmlld) - Engaging female voice
- **Bella** (EXAVITQu4vr4xnSDxMaL) - Soft female voice
- **Antoni** (ErXwobaYiN019PkySvjV) - Well-rounded male voice
- **Elli** (MF3mGyEYCl7XYWbV9V6O) - Emotional female voice
- **Josh** (TxGEqnHWrfWFTfGW9XjX) - Deep male voice
- **Arnold** (VR6AewLTigWG4xSOukaG) - Crisp male voice
- **Adam** (pNInz6obpgDQGcFmaJgB) - Deep male voice
- **Sam** (yoZ06aMxZJJ28mfd3POQ) - Raspy male voice

Use `GET /voices` to get the full list of available voices.

### Audio Response Headers
When using `/voice-chat-with-audio`, the response includes:
- `X-Response-Text`: URL-encoded transcription of the AI response
- `X-User-Message`: URL-encoded transcription of user's speech

Decode these in JavaScript using `decodeURIComponent()`.

---

## Frontend Integration Example

### JavaScript/TypeScript

```typescript
const API_BASE_URL = 'http://localhost:8000';

// Send a chat message
async function sendMessage(message: string) {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });
  
  const data = await response.json();
  return data.response;
}

// Get personality profile
async function getPersonality() {
  const response = await fetch(`${API_BASE_URL}/personality`);
  const data = await response.json();
  return data.personality;
}

// Voice chat with audio response
async function voiceChat(audioBlob: Blob, voiceId: string = '21m00Tcm4TlvDq8ikWAM') {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.webm');

  const response = await fetch(`${API_BASE_URL}/voice-chat-with-audio?voice_id=${voiceId}`, {
    method: 'POST',
    body: formData,
  });

  const audioBlob = await response.blob();
  const responseText = decodeURIComponent(response.headers.get('X-Response-Text') || '');
  const userMessage = decodeURIComponent(response.headers.get('X-User-Message') || '');

  return {
    audio: audioBlob,
    responseText,
    userMessage
  };
}

// Usage
const agentResponse = await sendMessage("Hello!");
console.log(agentResponse);

const personality = await getPersonality();
console.log(personality);

// Voice chat example
const { audio, responseText, userMessage } = await voiceChat(recordedAudioBlob);
const audioUrl = URL.createObjectURL(audio);
const audioElement = new Audio(audioUrl);
audioElement.play();
console.log(`You said: ${userMessage}`);
console.log(`Agent responded: ${responseText}`);
```

### React Component Example

```tsx
import { useState } from 'react';

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setLoading(true);
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: input }]);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      
      // Add agent response
      setMessages(prev => [...prev, { role: 'agent', content: data.response }]);
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  return (
    <div>
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role}>
            {msg.content}
          </div>
        ))}
      </div>
      
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        disabled={loading}
      />
      
      <button onClick={sendMessage} disabled={loading}>
        Send
      </button>
    </div>
  );
};
```

### Voice Recording Component Example

```tsx
import { useState, useRef } from 'react';

const VoiceChatComponent = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await sendVoiceMessage(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendVoiceMessage = async (audioBlob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    try {
      const response = await fetch('http://localhost:8000/voice-chat-with-audio', {
        method: 'POST',
        body: formData,
      });

      const responseAudioBlob = await response.blob();
      const responseText = decodeURIComponent(response.headers.get('X-Response-Text') || '');
      const userMessage = decodeURIComponent(response.headers.get('X-User-Message') || '');

      // Add to transcript
      setTranscript(prev => [
        ...prev,
        { role: 'user', text: userMessage },
        { role: 'agent', text: responseText }
      ]);

      // Play response audio
      const audio = new Audio(URL.createObjectURL(responseAudioBlob));
      audio.play();
    } catch (error) {
      console.error('Error sending voice message:', error);
    }
  };

  return (
    <div>
      <div className="transcript">
        {transcript.map((msg, idx) => (
          <div key={idx} className={msg.role}>
            <strong>{msg.role === 'user' ? 'You' : 'Agent'}:</strong> {msg.text}
          </div>
        ))}
      </div>
      
      <button
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        onTouchStart={startRecording}
        onTouchEnd={stopRecording}
        className={isRecording ? 'recording' : ''}
      >
        {isRecording ? 'Recording... (Release to send)' : 'Hold to Talk'}
      </button>
    </div>
  );
};
```

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `400` - Bad Request (e.g., missing message, transcription failed)
- `500` - Server Error (e.g., API issues, processing errors)

Error responses follow FastAPI standard format:
```json
{
  "detail": "Error message here"
}
```

## CORS

CORS is enabled for all origins (`*`). In production, configure specific allowed origins in `api.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Restrict to your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Rate Limiting

### Gemini API Limits
The Gemini API has rate limits:
- Free tier: 15 requests per minute, 1,500 requests per day
- Paid tier: Higher limits based on your plan

### ElevenLabs API Limits
ElevenLabs has character/request limits based on your subscription:
- Free tier: 10,000 characters per month
- Creator tier: 100,000 characters per month
- Pro tier: 500,000 characters per month

Consider implementing rate limiting on your API server for production use.

## Security Considerations

For production deployment:

1. **Environment Variables**: Never commit `.env` file (already in `.gitignore`)
2. **API Keys**: Keep `GOOGLE_API_KEY` and `ELEVENLABS_API_KEY` secure
3. **HTTPS**: Use SSL/TLS for all communications
4. **Authentication**: Add user authentication (JWT, OAuth, etc.)
5. **CORS**: Restrict to specific origins
6. **Rate Limiting**: Implement request rate limiting per user/IP
7. **Input Validation**: Sanitize all user inputs (text and audio)
8. **File Size Limits**: Limit audio file uploads (currently FastAPI default)
9. **Error Messages**: Don't expose sensitive information in errors
10. **Logging**: Implement proper logging and monitoring

## Interactive API Documentation

FastAPI provides automatic interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
  - Interactive interface to test all endpoints
  - View request/response schemas
  - Try out endpoints directly from browser

- **ReDoc**: http://localhost:8000/redoc
  - Alternative documentation view
  - Clean, organized layout
  - Easy to navigate

## Testing the API

### Using cURL

Test text chat:
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!"}'
```

Test voice chat:
```bash
curl -X POST http://localhost:8000/voice-chat \
  -F "audio=@test_recording.webm"
```

### Using the Demo Interface

Open the included demo page:
```bash
# Make sure API is running (python api.py)
# Then in another terminal:
cd /Users/max/Junction/narrio/backend/agent
python -m http.server 8080
```

Visit http://localhost:8080/voice_demo.html

### Using Python

```python
import requests

# Text chat
response = requests.post(
    'http://localhost:8000/chat',
    json={'message': 'Hello, how are you?'}
)
print(response.json())

# Voice chat
with open('recording.webm', 'rb') as audio_file:
    response = requests.post(
        'http://localhost:8000/voice-chat',
        files={'audio': audio_file}
    )
    print(response.json())
```

### Using Postman/Insomnia

1. Import endpoints from Swagger JSON: http://localhost:8000/openapi.json
2. Or manually create requests using the endpoint documentation above

## Troubleshooting

### Audio Issues

**Problem**: "Could not transcribe audio"
- **Solution**: Ensure audio file is not empty and is in a supported format
- **Check**: File size should be > 0 bytes
- **Try**: Test with different recording devices or browsers

**Problem**: No audio playback in browser
- **Solution**: Check browser console for errors
- **Check**: Verify response Content-Type is `audio/mpeg`
- **Try**: Test audio URL directly in browser

### API Connection Issues

**Problem**: Cannot connect to API
- **Solution**: Ensure `python api.py` is running
- **Check**: Port 8000 is not in use by another application
- **Try**: Check firewall settings

**Problem**: CORS errors in browser
- **Solution**: Verify CORS is enabled in `api.py`
- **Check**: Request origin matches allowed origins
- **Try**: Use `allow_origins=["*"]` for testing (not for production)

### ElevenLabs Issues

**Problem**: Voice synthesis fails
- **Solution**: Check `ELEVENLABS_API_KEY` in `.env`
- **Check**: API key has sufficient quota
- **Try**: Use a different voice_id

**Problem**: "Invalid voice_id"
- **Solution**: Get valid voice IDs from `GET /voices`
- **Check**: Voice ID is exactly 20 characters
- **Try**: Use default voice (omit voice_id parameter)
