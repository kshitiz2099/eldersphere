"""
 Narrio Companion Agent
A psychotherapist/companion agent designed to improve elderly wellbeing through
meaningful conversation and personality understanding.
"""

import os
import json
from typing import Dict, Any, Optional, List
import re
from datetime import datetime
import asyncio



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
        # In-memory cache of personality data to avoid repeated file I/O
        self._personality_cache: Dict[str, Any] = self._load_personality_from_disk()
    
    def _ensure_cv_exists(self):
        """Create CV.json if it doesn't exist."""
        if not os.path.exists(self.cv_path):
            with open(self.cv_path, 'w') as f:
                json.dump({"personality": {}}, f, indent=2)

    def _load_personality_from_disk(self) -> Dict[str, Any]:
        try:
            with open(self.cv_path, 'r') as f:
                data = json.load(f)
                return data.get("personality", {})
        except (FileNotFoundError, json.JSONDecodeError):
            return {}
    
    def load_personality(self) -> Dict[str, Any]:
        """Load personality data from CV.json."""
        # Return cached copy to avoid file reads for each access
        if self._personality_cache is None:
            self._personality_cache = self._load_personality_from_disk()
        return self._personality_cache
    
    def update_personality(self, new_info: Dict[str, Any]) -> bool:
        """
        Update personality information only if there's new data.
        Returns True if update was made, False otherwise.
        """
        # If empty dict passed, clear personality
        current_personality = self.load_personality() or {}

        if new_info == {}:
            if current_personality:
                self._personality_cache = {}
                with open(self.cv_path, 'w') as f:
                    json.dump({"personality": {}}, f, indent=2)
                return True
            return False

        # Merge new info; only write if changed
        has_new_info = False
        for key, value in new_info.items():
            if key not in current_personality or current_personality.get(key) != value:
                has_new_info = True
                current_personality[key] = value

        if has_new_info:
            self._personality_cache = current_personality
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


class NarrioAgent:
    """
    A companion agent that engages elderly users in meaningful conversation
    to improve their wellbeing through active listening and therapeutic dialogue.
    """
    
    def __init__(self, api_key: Optional[str] = None, cv_path: str = "CV.json"):
        """
        Initialize the Narrio Agent.
        
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
            model="gemini-2.0-flash",
            google_api_key=self.api_key,
            temperature=0.7,
            #convert_system_message_to_human=True
            streaming=True,
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

    # NOTE: Removed separate extraction LLM call to reduce latency. Extraction is
    # performed in the same model response as the agent reply (see `chat`).
    
    def chat(self, user_message: str) -> str:
        """
        Process a user message and return the agent's response.
        
        Args:
            user_message: The user's message.
            
        Returns:
            The agent's response.
        """
        # Get conversation history and trim to recent messages to reduce tokens
        chat_history: List[Any] = self.message_history.messages or []
        recent_history = chat_history[-12:]

        # We instruct the model to return the natural reply followed by a JSON
        # object (between markers) that contains ONLY NEW personality info.
        PERSONA_START = "<<<PERSONALITY_JSON_START>>>"
        PERSONA_END = "<<<PERSONALITY_JSON_END>>>"

        instruction_for_extraction = (
            "\n\nAfter you produce a natural, empathetic reply to the user, append a JSON "
            "object containing ONLY NEW personality information (traits, hobbies, preferences, "
            "etc.) that you can infer from this interaction. Place that JSON between the "
            "markers:\n"
            f"{PERSONA_START}\n{{}}\n{PERSONA_END}\n"
            "If there is no new information, put an empty JSON object between the markers. "
            "Do not include any extra text inside the markers — only a valid JSON object."
        )

        messages: List[Any] = [SystemMessage(content=self.system_prompt + instruction_for_extraction)]
        messages.extend(recent_history)
        messages.append(HumanMessage(content=user_message))

        # Single LLM call: returns both human-friendly reply and JSON extraction
        response = self.llm.invoke(messages)
        full_response = response.content
        
        # response = await self.llm.agenerate([messages])
        # full_response = response.generations[0].message.content


        # Try to extract the JSON section between the markers
        personality_insights: Dict[str, Any] = {}
        try:
            start_idx = full_response.find(PERSONA_START)
            end_idx = full_response.find(PERSONA_END)
            if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
                json_text = full_response[start_idx + len(PERSONA_START):end_idx].strip()
                # Remove any code fences
                json_text = re.sub(r"^```json\\n|```$", "", json_text).strip()
                if json_text:
                    personality_insights = json.loads(json_text)

                # The visible reply should exclude the JSON markers and content
                visible_reply = (full_response[:start_idx] + full_response[end_idx + len(PERSONA_END):]).strip()
            else:
                # No markers found: treat entire content as visible reply
                visible_reply = full_response.strip()
        except Exception as e:
            print(f"[WARN] Failed to parse personality JSON: {e}")
            visible_reply = full_response.strip()

        # Update message history with the user message and visible assistant reply
        self.message_history.add_user_message(user_message)
        self.message_history.add_ai_message(visible_reply)

        # If new personality info was found, update CV and refresh system prompt
        if personality_insights:
            updated = self.cv_manager.update_personality(personality_insights)
            if updated:
                print(f"[DEBUG] Updated CV with new personality insights: {list(personality_insights.keys())}")
                self.system_prompt = self._create_system_prompt()

        return visible_reply
    
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
    print(" Narrio Companion Agent")
    print("=" * 60)
    print("Type 'quit' to exit")
    print("Type 'profile' to see personality profile")
    print("Type 'reset' to clear conversation history")
    print("=" * 60)
    print()
    
    # Initialize agent
    try:
        agent = NarrioAgent()
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
