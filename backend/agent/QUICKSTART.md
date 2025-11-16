# Quick Start Guide - Narrio Companion Agent

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
cd backend/agent
./setup.sh
```

Or manually:
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Get Your Google API Key
1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key

### 3. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` and add your API key:
```
GOOGLE_API_KEY=your_actual_api_key_here
```

### 4. Run the Agent
```bash
source venv/bin/activate  # If not already activated
python agent.py
```

## 💬 Example Conversation

```
Agent: Hello! I'm so glad to spend time with you today. How are you feeling?

You: Hi, I'm feeling a bit lonely today.

Agent: I'm so sorry to hear you're feeling lonely. I'm here for you, and I'd 
love to chat. Loneliness can be really tough. What do you usually enjoy doing 
when you have some free time? Perhaps we can talk about some of your interests 
or hobbies?

You: I used to love gardening. I had beautiful roses.

Agent: Roses! How wonderful! Gardening is such a rewarding hobby. Tell me more 
about your roses - what were your favorite varieties? Did you have a particular 
color you loved most?
```

## 🧪 Test the Agent

```bash
python test_agent.py
```

## 📊 View Personality Profile

During a conversation, type `profile` to see what the agent has learned:

```
You: profile

--- Personality Profile ---
{
  "hobbies": ["gardening", "growing roses"],
  "emotional_state": "sometimes feels lonely",
  "interests": ["flowers", "outdoor activities"]
}
```

## 🔧 Common Issues

### "GOOGLE_API_KEY not found"
- Make sure you created the `.env` file
- Make sure you added your actual API key (not the example text)
- The `.env` file should be in the same directory as `agent.py`

### Import errors
- Make sure you activated the virtual environment: `source venv/bin/activate`
- Make sure dependencies are installed: `pip install -r requirements.txt`

### API quota exceeded
- Free tier has limits on requests per minute
- Wait a few minutes and try again
- Consider upgrading your API plan

## 📝 Available Commands

When chatting with the agent:
- `quit` - Exit the conversation
- `profile` - View learned personality traits
- `reset` - Clear conversation history (keeps personality data)

## 🎯 Tips for Best Results

1. **Be specific**: Share details about your life, interests, and feelings
2. **Be patient**: The agent learns gradually over multiple conversations
3. **Be honest**: The agent is designed to provide emotional support
4. **Engage regularly**: Consistent conversations build better understanding

## 🔒 Privacy

- All personality data is stored locally in `CV.json`
- Conversation history is cleared when you exit the program
- Only personality insights are persisted between sessions
- Your data never leaves your machine except for API calls to Google

## 📚 Next Steps

- Integrate with the Narrio app UI
- Add voice input/output capabilities
- Implement daily check-in reminders
- Add mood tracking over time
- Create personalized activity suggestions

## 🆘 Need Help?

Check the main README.md for detailed documentation or open an issue on GitHub.
