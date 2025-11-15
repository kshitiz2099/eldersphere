# ElderSphere Agent API Documentation

RESTful API for the ElderSphere Companion Agent.

## Base URL
```
http://localhost:5000
```

## Running the API Server

```bash
source venv/bin/activate
python api.py
```

## Endpoints

### 1. Health Check
Check if the API server is running.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "healthy",
  "service": "ElderSphere Companion Agent"
}
```

**Example:**
```bash
curl http://localhost:5000/health
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
  "error": "Missing message in request body",
  "success": false
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/chat \
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
curl http://localhost:5000/personality
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
curl -X POST http://localhost:5000/reset
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
curl -X POST http://localhost:5000/reset-all
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
curl http://localhost:5000/greeting
```

---

## Frontend Integration Example

### JavaScript/TypeScript

```typescript
const API_BASE_URL = 'http://localhost:5000';

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

// Usage
const agentResponse = await sendMessage("Hello!");
console.log(agentResponse);

const personality = await getPersonality();
console.log(personality);
```

### React Component Example

```tsx
import { useState, useEffect } from 'react';

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
      const response = await fetch('http://localhost:5000/chat', {
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

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `400` - Bad Request (e.g., missing message)
- `500` - Server Error (e.g., API issues)

Error responses include:
```json
{
  "error": "Error message here",
  "success": false
}
```

## CORS

CORS is enabled for all origins. In production, configure specific allowed origins in `api.py`.

## Rate Limiting

The Gemini API has rate limits on the free tier:
- 60 requests per minute
- 1,500 requests per day

Consider implementing rate limiting on your API server for production use.

## Security Considerations

For production deployment:

1. **Environment Variables**: Never commit `.env` file
2. **HTTPS**: Use SSL/TLS for all communications
3. **Authentication**: Add user authentication
4. **CORS**: Restrict to specific origins
5. **Rate Limiting**: Implement request rate limiting
6. **Input Validation**: Sanitize all user inputs
7. **Error Messages**: Don't expose sensitive information

## WebSocket Support (Future)

For real-time chat, consider implementing WebSocket support:

```python
from flask_socketio import SocketIO, emit

socketio = SocketIO(app, cors_allowed_origins="*")

@socketio.on('message')
def handle_message(data):
    agent_response = get_agent().chat(data['message'])
    emit('response', {'response': agent_response})
```

## Testing the API

Use the provided test script:

```bash
python test_api.py
```

Or use tools like:
- Postman
- Insomnia
- curl
- HTTPie
