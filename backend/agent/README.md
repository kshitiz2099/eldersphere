# ElderSphere Companion Agent

A psychotherapist/companion agent powered by Google's Gemini API and LangChain, designed to improve elderly wellbeing through meaningful conversations.

## Features

- **Empathetic Conversation**: Engages users in warm, therapeutic dialogue
- **Personality Learning**: Automatically extracts and stores personality traits, interests, and preferences
- **Smart CV Updates**: Only updates the CV.json file when new information is discovered
- **Memory**: Maintains conversation context throughout the session
- **Therapeutic Approach**: Asks thoughtful questions about life, interests, and experiences

## Setup

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure API Key**:
   - Copy `.env.example` to `.env`
   - Add your Google API key:
     ```
     GOOGLE_API_KEY=your_actual_api_key_here
     ```
   - Get your API key from: https://makersuite.google.com/app/apikey

3. **Run the Agent**:
   ```bash
   python agent.py
   ```

## Usage

### Interactive CLI

Run `python agent.py` to start an interactive conversation:

```
You: Hi, I'm feeling a bit lonely today.
Agent: I'm so sorry to hear you're feeling lonely. I'm here for you...
```

**Commands**:
- `quit` - Exit the conversation
- `profile` - View the current personality profile
- `reset` - Clear conversation history (keeps personality data)

### Programmatic Usage

```python
from agent import ElderSphereAgent

# Initialize the agent
agent = ElderSphereAgent()

# Have a conversation
response = agent.chat("Hello, I love gardening!")
print(response)

# Check what personality traits were learned
profile = agent.get_personality_profile()
print(profile)
```

## How It Works

1. **Conversation**: The agent engages in warm, empathetic dialogue designed to make elderly users feel valued and heard.

2. **Personality Extraction**: After each interaction, the agent analyzes the conversation to identify personality traits, interests, preferences, and life experiences.

3. **Smart CV Updates**: The CV.json file is only updated when NEW information is discovered, preventing redundant writes.

4. **Adaptive Responses**: The agent uses the accumulated personality knowledge to provide more personalized and relevant responses over time.

## CV Structure

The `CV.json` file stores personality information:

```json
{
  "personality": {
    "hobbies": ["gardening", "reading"],
    "family_details": "Has two grandchildren",
    "preferences": "Prefers morning conversations",
    "emotional_traits": "Optimistic, sometimes feels lonely",
    "life_experiences": "Worked as a teacher for 30 years"
  }
}
```

## Architecture

- **LangChain**: Orchestrates the conversation flow and memory management
- **Gemini Pro**: Powers the conversational AI with empathetic responses
- **CVManager**: Handles personality data storage and updates
- **ConversationBufferMemory**: Maintains context throughout the session

## Therapeutic Approach

The agent is designed with therapeutic principles:
- Active listening
- Open-ended questions
- Validation and empathy
- Non-judgmental support
- Focus on wellbeing and positive engagement

## Customization

You can customize the agent's behavior by modifying:
- `system_prompt` in `_create_system_prompt()` - Adjust the agent's personality and approach
- `temperature` parameter - Control response creativity (0.0 = focused, 1.0 = creative)
- Model selection - Use different Gemini models (`gemini-pro`, `gemini-1.5-pro`, etc.)

## Notes

- The agent maintains conversation context only during a session
- Personality data persists across sessions in `CV.json`
- Use `reset_conversation()` to start fresh while keeping personality data
- Use `reset_all()` to clear everything including personality data

## Requirements

- Python 3.8+
- Google API Key with Gemini API access
- See `requirements.txt` for package dependencies
