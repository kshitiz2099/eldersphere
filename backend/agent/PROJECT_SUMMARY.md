# Narrio Companion Agent - Project Summary

## 🎯 Overview

A Gemini-powered AI companion/psychotherapist designed to improve elderly wellbeing through empathetic conversations. The agent learns about the user's personality and interests over time, storing insights in a JSON CV file.

## 📁 Project Structure

```
backend/agent/
├── agent.py              # Main agent implementation
├── api.py                # REST API wrapper for frontend integration
├── CV.json               # Personality data storage
├── requirements.txt      # Python dependencies
├── .env.example          # Environment variable template
├── .gitignore           # Git ignore rules
├── setup.sh             # Automated setup script
├── example_usage.py     # Usage examples
├── test_agent.py        # Test suite
├── README.md            # Main documentation
├── QUICKSTART.md        # Quick start guide
└── API_DOCS.md          # API documentation
```

## 🔑 Key Features

### 1. **Empathetic Conversation**
- Warm, therapeutic dialogue style
- Active listening approach
- Open-ended questions about life, interests, and experiences
- Emotional support and validation

### 2. **Personality Learning**
- Automatically extracts personality traits from conversations
- Stores insights in structured JSON format
- Categories: hobbies, interests, family, preferences, emotional traits, life experiences

### 3. **Smart CV Updates**
- Only updates `CV.json` when NEW information is discovered
- Prevents redundant writes
- Merges new information with existing data
- Incremental learning over time

### 4. **LangChain Integration**
- Uses LangChain for conversation orchestration
- ConversationBufferMemory for context retention
- Structured prompts and message handling
- Easy to extend and customize

### 5. **Gemini API**
- Powered by Google's Gemini Pro model
- Natural, human-like responses
- Contextual understanding
- Configurable temperature for response creativity

## 🏗️ Architecture

```
┌─────────────────┐
│   User Input    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Narrio    │
│     Agent       │
│  ┌───────────┐  │
│  │ LangChain │  │
│  │  Memory   │  │
│  └───────────┘  │
│  ┌───────────┐  │
│  │  Gemini   │  │
│  │    API    │  │
│  └───────────┘  │
└────────┬────────┘
         │
    ┌────┴─────┐
    │          │
    ▼          ▼
┌────────┐  ┌───────────┐
│ Agent  │  │    CV     │
│Response│  │  Manager  │
└────────┘  └─────┬─────┘
                  │
                  ▼
            ┌──────────┐
            │ CV.json  │
            │{         │
            │personality│
            │}         │
            └──────────┘
```

## 🚀 Quick Start

```bash
# 1. Setup
cd backend/agent
./setup.sh

# 2. Configure
cp .env.example .env
# Edit .env and add your GOOGLE_API_KEY

# 3. Run
source venv/bin/activate
python agent.py

# 4. Or run API server
python api.py
```

## 💡 Usage Examples

### Command Line
```python
from agent import NarrioAgent

agent = NarrioAgent()
response = agent.chat("I love gardening!")
print(response)

profile = agent.get_personality_profile()
print(profile)
```

### REST API
```bash
# Send message
curl -X POST http://localhost:5000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!"}'

# Get personality
curl http://localhost:5000/personality
```

### Frontend Integration
```typescript
const response = await fetch('http://localhost:5000/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: "Hello!" })
});

const data = await response.json();
console.log(data.response);
```

## 🧠 How Personality Learning Works

1. **User sends a message** → Agent responds empathetically
2. **After response** → Agent analyzes conversation for personality insights
3. **Extraction** → LLM extracts new traits (hobbies, interests, etc.)
4. **Comparison** → Compares with existing CV data
5. **Update** → Only writes to CV.json if new information found
6. **Adaptation** → System prompt updated with new personality context

### Example CV Evolution

**After conversation 1:**
```json
{
  "personality": {
    "hobbies": ["gardening"]
  }
}
```

**After conversation 2:**
```json
{
  "personality": {
    "hobbies": ["gardening", "reading"],
    "family_details": "Has two grandchildren"
  }
}
```

**After conversation 3:**
```json
{
  "personality": {
    "hobbies": ["gardening", "reading", "painting"],
    "family_details": "Has two grandchildren who visit on weekends",
    "emotional_traits": "Optimistic, sometimes feels lonely",
    "preferences": "Enjoys morning conversations"
  }
}
```

## 🛠️ Technical Components

### CVManager
- Handles CV.json file operations
- Loads/saves personality data
- Detects new information
- Prevents redundant updates

### NarrioAgent
- Main agent class
- Manages conversation flow
- Integrates LangChain components
- Coordinates personality extraction
- Provides chat interface

### System Prompt
- Defines agent personality
- Sets conversation goals
- Includes known personality context
- Updates dynamically as learning occurs

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/chat` | Send message, get response |
| GET | `/personality` | Get personality profile |
| POST | `/reset` | Clear conversation history |
| POST | `/reset-all` | Clear everything |
| GET | `/greeting` | Get initial greeting |

## 🧪 Testing

```bash
# Run test suite
python test_agent.py

# Run examples
python example_usage.py
```

## 🔐 Environment Variables

```bash
GOOGLE_API_KEY=your_gemini_api_key_here
```

Get your key from: https://makersuite.google.com/app/apikey

## 📦 Dependencies

- **langchain** - Agent orchestration
- **langchain-google-genai** - Gemini integration
- **python-dotenv** - Environment variables
- **pydantic** - Data validation
- **flask** - REST API (optional)
- **flask-cors** - CORS support (optional)

## 🎨 Customization Options

### Adjust Agent Personality
Modify `_create_system_prompt()` in `agent.py`

### Change Response Style
Adjust `temperature` parameter (0.0 = focused, 1.0 = creative)

### Use Different Model
```python
self.llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-pro",  # or "gemini-ultra"
    ...
)
```

### Custom Personality Categories
Modify extraction prompt in `_extract_personality_insights()`

## 🚦 Production Considerations

- [ ] Implement authentication
- [ ] Add rate limiting
- [ ] Use HTTPS/SSL
- [ ] Implement data encryption
- [ ] Add logging and monitoring
- [ ] Set up error tracking
- [ ] Implement backup system for CV.json
- [ ] Add multi-user support
- [ ] Implement WebSocket for real-time chat
- [ ] Add voice input/output

## 📈 Future Enhancements

- Voice conversation support
- Mood tracking over time
- Activity suggestions based on interests
- Daily check-in reminders
- Integration with health monitoring
- Multi-language support
- Family member access/updates
- Memory recall features ("Remember when...")
- Photo/memory sharing integration

## 🎯 Therapeutic Goals

1. **Reduce Loneliness** - Provide companionship
2. **Maintain Cognitive Health** - Engage in conversation
3. **Emotional Support** - Validate feelings
4. **Build Connection** - Show genuine interest
5. **Encourage Expression** - Create safe space to share

## 📝 Notes

- Conversation memory is session-based (cleared on exit)
- Personality data persists in CV.json
- API key required for all operations
- Free tier has rate limits (60 req/min)
- CV updates happen asynchronously after responses

## 🤝 Integration with Narrio App

The agent is designed to integrate with the frontend React app:

1. Use the REST API (`api.py`)
2. Connect to `/chat` endpoint for conversations
3. Display personality insights in user profile
4. Use for daily check-ins and wellness tracking
5. Integrate with family view for updates

## ✅ Completed Features

- ✅ Gemini API integration
- ✅ LangChain framework
- ✅ Personality extraction
- ✅ Smart CV updates (only new info)
- ✅ Conversation memory
- ✅ REST API
- ✅ CLI interface
- ✅ Test suite
- ✅ Documentation
- ✅ Setup automation

## 🎓 Learning Resources

- [LangChain Documentation](https://python.langchain.com/)
- [Gemini API Guide](https://ai.google.dev/docs)
- [ElderCare Best Practices](https://www.nia.nih.gov/)

---

**Created for Narrio** - Improving elderly wellbeing through AI companionship
