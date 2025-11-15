"""
ElderSphere Companion Agent
A psychotherapist/companion agent designed to improve elderly wellbeing through
meaningful conversation and personality understanding.
"""

import os
import json
from typing import Dict, Any, Optional
from datetime import datetime

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class CVManager:
    """Manages the CV.json file containing personality information."""
    
    def __init__(self, cv_path: str = "CV.json"):
        self.cv_path = cv_path
        self._ensure_cv_exists()
    
    def _ensure_cv_exists(self):
        """Create CV.json if it doesn't exist."""
        if not os.path.exists(self.cv_path):
            with open(self.cv_path, 'w') as f:
                json.dump({"personality": {}}, f, indent=2)
    
    def load_personality(self) -> Dict[str, Any]:
        """Load personality data from CV.json."""
        try:
            with open(self.cv_path, 'r') as f:
                data = json.load(f)
                return data.get("personality", {})
        except (FileNotFoundError, json.JSONDecodeError):
            return {}
    
    def update_personality(self, new_info: Dict[str, Any]) -> bool:
        """
        Update personality information only if there's new data.
        Returns True if update was made, False otherwise.
        """
        current_personality = self.load_personality()
        
        # Check if there's actually new information
        has_new_info = False
        for key, value in new_info.items():
            if key not in current_personality or current_personality[key] != value:
                has_new_info = True
                current_personality[key] = value
        
        if has_new_info:
            with open(self.cv_path, 'w') as f:
                json.dump({"personality": current_personality}, f, indent=2)
            return True
        
        return False
    
    def get_personality_summary(self) -> str:
        """Get a formatted summary of known personality traits."""
        personality = self.load_personality()
        if not personality:
            return "No personality information recorded yet."
        
        summary_parts = []
        for key, value in personality.items():
            if isinstance(value, list):
                summary_parts.append(f"- {key}: {', '.join(value)}")
            else:
                summary_parts.append(f"- {key}: {value}")
        
        return "\n".join(summary_parts)


class ElderSphereAgent:
    """
    A companion agent that engages elderly users in meaningful conversation
    to improve their wellbeing through active listening and therapeutic dialogue.
    """
    
    def __init__(self, api_key: Optional[str] = None, cv_path: str = "CV.json"):
        """
        Initialize the ElderSphere Agent.
        
        Args:
            api_key: Google API key for Gemini. If None, uses GOOGLE_API_KEY env var.
            cv_path: Path to the CV.json file.
        """
        self.api_key = api_key or os.getenv("GOOGLE_API_KEY")
        if not self.api_key:
            raise ValueError("GOOGLE_API_KEY not found. Please set it in .env file.")
        
        # Initialize CV manager
        self.cv_manager = CVManager(cv_path)
        
        # Initialize the Gemini model
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            google_api_key=self.api_key,
            temperature=0.7,
            convert_system_message_to_human=True
        )
        
        # Initialize conversation memory using ChatMessageHistory
        self.message_history = ChatMessageHistory()
        
        # System prompt for the agent
        self.system_prompt = self._create_system_prompt()
    
    def _create_system_prompt(self) -> str:
        """Create the system prompt for the agent."""
        personality_summary = self.cv_manager.get_personality_summary()
        
        return f"""You are a warm, empathetic companion and psychotherapist dedicated to improving the wellbeing of elderly individuals. Your role is to:

1. **Be a Caring Listener**: Show genuine interest in their life, experiences, and stories.
2. **Encourage Conversation**: Ask thoughtful, open-ended questions about their:
   - Life experiences and memories
   - Hobbies and interests
   - Family and relationships
   - Daily activities and routines
   - Dreams and aspirations
   - Feelings and emotions

3. **Build Understanding**: Pay attention to personality traits, preferences, and values they express.
4. **Provide Emotional Support**: Offer validation, encouragement, and gentle guidance.
5. **Be Patient and Respectful**: Allow them to share at their own pace.
6. **Foster Wellbeing**: Help them feel valued, heard, and connected.

**Communication Style**:
- Use warm, conversational language
- Be encouraging and positive
- Show empathy and understanding
- Ask one or two questions at a time
- Avoid being clinical or overly formal
- Use appropriate humor when suitable
- Acknowledge and validate their feelings

**Current Known Personality Information**:
{personality_summary}

Remember: Your goal is to make them feel comfortable, valued, and engaged in meaningful conversation. Every interaction should leave them feeling better than before."""

    def _extract_personality_insights(self, conversation: str, response: str) -> Dict[str, Any]:
        """
        Use the LLM to extract personality insights from the conversation.
        """
        extraction_prompt = f"""Based on the following conversation, identify any NEW personality traits, interests, preferences, or characteristics about the person. Only extract clear, specific information.

Conversation:
User: {conversation}
Assistant: {response}

Known personality information:
{self.cv_manager.get_personality_summary()}

Extract ONLY NEW information not already recorded. Format as JSON with descriptive keys (e.g., "hobbies", "family_details", "preferences", "life_experiences", "emotional_traits", etc.).

If there is no new personality information to extract, return an empty JSON object: {{}}.

Return only valid JSON, nothing else."""

        try:
            extraction_response = self.llm.invoke([HumanMessage(content=extraction_prompt)])
            
            # Parse the JSON response
            response_text = extraction_response.content.strip()
            
            # Remove markdown code blocks if present
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.startswith("```"):
                response_text = response_text[3:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            
            response_text = response_text.strip()
            
            personality_info = json.loads(response_text)
            return personality_info if personality_info else {}
            
        except Exception as e:
            print(f"Error extracting personality insights: {e}")
            return {}
    
    def chat(self, user_message: str) -> str:
        """
        Process a user message and return the agent's response.
        
        Args:
            user_message: The user's message.
            
        Returns:
            The agent's response.
        """
        # Get conversation history
        chat_history = self.message_history.messages
        
        # Create the full prompt
        messages = [
            SystemMessage(content=self.system_prompt)
        ]
        
        # Add chat history
        messages.extend(chat_history)
        
        # Add current user message
        messages.append(HumanMessage(content=user_message))
        
        # Get response from LLM
        response = self.llm.invoke(messages)
        agent_response = response.content
        
        # Update message history
        self.message_history.add_user_message(user_message)
        self.message_history.add_ai_message(agent_response)
        
        # Extract and update personality insights
        personality_insights = self._extract_personality_insights(user_message, agent_response)
        if personality_insights:
            updated = self.cv_manager.update_personality(personality_insights)
            if updated:
                print(f"[DEBUG] Updated CV with new personality insights: {list(personality_insights.keys())}")
                # Refresh system prompt with new personality info
                self.system_prompt = self._create_system_prompt()
        
        return agent_response
    
    def get_personality_profile(self) -> Dict[str, Any]:
        """Get the current personality profile."""
        return self.cv_manager.load_personality()
    
    def reset_conversation(self):
        """Reset the conversation history (but keep personality data)."""
        self.message_history.clear()
        print("[INFO] Conversation history cleared.")
    
    def reset_all(self):
        """Reset both conversation and personality data."""
        self.message_history.clear()
        self.cv_manager.update_personality({})
        print("[INFO] All data cleared.")


def main():
    """Interactive CLI for testing the agent."""
    print("=" * 60)
    print("ElderSphere Companion Agent")
    print("=" * 60)
    print("Type 'quit' to exit")
    print("Type 'profile' to see personality profile")
    print("Type 'reset' to clear conversation history")
    print("=" * 60)
    print()
    
    # Initialize agent
    try:
        agent = ElderSphereAgent()
    except ValueError as e:
        print(f"Error: {e}")
        print("Please create a .env file with your GOOGLE_API_KEY")
        return
    
    # Start greeting
    print("Agent: Hello! I'm so glad to spend time with you today. How are you feeling?")
    print()
    
    while True:
        try:
            # Get user input
            user_input = input("You: ").strip()
            
            if not user_input:
                continue
            
            # Handle commands
            if user_input.lower() == 'quit':
                print("\nAgent: It was wonderful talking with you. Take care!")
                break
            
            elif user_input.lower() == 'profile':
                profile = agent.get_personality_profile()
                print("\n--- Personality Profile ---")
                print(json.dumps(profile, indent=2))
                print("---" * 10)
                print()
                continue
            
            elif user_input.lower() == 'reset':
                agent.reset_conversation()
                print()
                continue
            
            # Get agent response
            response = agent.chat(user_input)
            print(f"\nAgent: {response}\n")
            
        except KeyboardInterrupt:
            print("\n\nAgent: It was wonderful talking with you. Take care!")
            break
        except Exception as e:
            print(f"\nError: {e}\n")


if __name__ == "__main__":
    main()
