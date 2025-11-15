"""
Example usage of the ElderSphere Agent.
Demonstrates different ways to interact with the agent.
"""

from agent import ElderSphereAgent
import json


def example_conversation():
    """Example of a natural conversation flow."""
    print("=" * 60)
    print("Example Conversation with ElderSphere Agent")
    print("=" * 60)
    print()
    
    # Initialize agent
    agent = ElderSphereAgent()
    
    # Simulated conversation
    conversations = [
        "Hello! I'm feeling a bit lonely today.",
        "I used to love gardening, especially growing roses. I had a beautiful garden at my old house.",
        "Yes, I have two wonderful grandchildren. They visited me last weekend.",
        "I worked as a school teacher for 35 years. I taught mathematics to high school students.",
        "I love reading mystery novels. Agatha Christie is my favorite author.",
        "Sometimes I feel sad when I think about my late husband. We were married for 50 years."
    ]
    
    for user_msg in conversations:
        print(f"You: {user_msg}")
        response = agent.chat(user_msg)
        print(f"\nAgent: {response}\n")
        print("-" * 60)
        print()
    
    # Show learned personality
    print("\n" + "=" * 60)
    print("Learned Personality Profile")
    print("=" * 60)
    profile = agent.get_personality_profile()
    print(json.dumps(profile, indent=2))
    print()


def example_therapeutic_session():
    """Example of a focused therapeutic session."""
    print("=" * 60)
    print("Therapeutic Session Example")
    print("=" * 60)
    print()
    
    agent = ElderSphereAgent()
    
    # Session focused on emotional wellbeing
    session = [
        "I've been feeling anxious lately about my health.",
        "The doctor says everything is fine, but I still worry.",
        "I try to stay active. I go for walks in the park every morning.",
        "Yes, I do have a few good friends. We play cards together on Thursdays."
    ]
    
    for msg in session:
        print(f"You: {msg}")
        response = agent.chat(msg)
        print(f"\nAgent: {response}\n")
        print("-" * 60)
        print()


def example_interest_exploration():
    """Example of exploring hobbies and interests."""
    print("=" * 60)
    print("Interest Exploration Example")
    print("=" * 60)
    print()
    
    agent = ElderSphereAgent()
    
    interests = [
        "I've been thinking about taking up painting. I always wanted to try it.",
        "I love classical music, especially Beethoven and Mozart.",
        "I enjoy cooking traditional recipes that my mother taught me.",
        "I like watching nature documentaries on television."
    ]
    
    for msg in interests:
        print(f"You: {msg}")
        response = agent.chat(msg)
        print(f"\nAgent: {response}\n")
        print("-" * 60)
        print()
    
    # Show the enriched profile
    print("\n" + "=" * 60)
    print("Updated Personality Profile")
    print("=" * 60)
    profile = agent.get_personality_profile()
    print(json.dumps(profile, indent=2))
    print()


def main():
    """Run all examples."""
    choice = input("""
Choose an example to run:
1. Natural Conversation
2. Therapeutic Session
3. Interest Exploration
4. Run All

Enter choice (1-4): """).strip()
    
    print("\n")
    
    if choice == "1":
        example_conversation()
    elif choice == "2":
        example_therapeutic_session()
    elif choice == "3":
        example_interest_exploration()
    elif choice == "4":
        print("Running all examples...\n")
        example_conversation()
        input("\nPress Enter to continue to next example...")
        example_therapeutic_session()
        input("\nPress Enter to continue to next example...")
        example_interest_exploration()
    else:
        print("Invalid choice. Running natural conversation example...")
        example_conversation()


if __name__ == "__main__":
    main()
