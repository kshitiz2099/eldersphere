"""
Test script for the ElderSphere Agent.
Tests key functionality without requiring manual interaction.
"""

import json
import os
from agent import ElderSphereAgent, CVManager


def test_cv_manager():
    """Test CV manager functionality."""
    print("Testing CV Manager...")
    
    # Create a test CV file
    test_cv_path = "test_CV.json"
    
    # Clean up any existing test file
    if os.path.exists(test_cv_path):
        os.remove(test_cv_path)
    
    cv = CVManager(test_cv_path)
    
    # Test 1: Empty personality
    personality = cv.load_personality()
    assert personality == {}, "Initial personality should be empty"
    print("✓ Empty personality test passed")
    
    # Test 2: Update with new info
    new_info = {"hobbies": ["gardening", "reading"], "age": 75}
    updated = cv.update_personality(new_info)
    assert updated == True, "Should return True when updating with new info"
    print("✓ Update with new info test passed")
    
    # Test 3: Update with same info (should not update)
    updated = cv.update_personality(new_info)
    assert updated == False, "Should return False when no new info"
    print("✓ No update with same info test passed")
    
    # Test 4: Update with partial new info
    partial_new = {"hobbies": ["gardening", "reading"], "location": "California"}
    updated = cv.update_personality(partial_new)
    assert updated == True, "Should return True when partial new info"
    print("✓ Partial update test passed")
    
    # Test 5: Verify merged data
    personality = cv.load_personality()
    assert "hobbies" in personality, "Should have hobbies"
    assert "age" in personality, "Should have age"
    assert "location" in personality, "Should have location"
    print("✓ Data merge test passed")
    
    # Clean up
    os.remove(test_cv_path)
    
    print("✅ All CV Manager tests passed!\n")


def test_agent_initialization():
    """Test agent initialization."""
    print("Testing Agent Initialization...")
    
    try:
        # This will fail if GOOGLE_API_KEY is not set
        agent = ElderSphereAgent(cv_path="test_agent_CV.json")
        print("✓ Agent initialized successfully")
        
        # Clean up
        if os.path.exists("test_agent_CV.json"):
            os.remove("test_agent_CV.json")
        
        print("✅ Agent initialization test passed!\n")
        return True
        
    except ValueError as e:
        print(f"⚠️  Agent initialization requires GOOGLE_API_KEY")
        print(f"   Error: {e}")
        print("   Skipping agent interaction tests\n")
        return False


def test_agent_chat():
    """Test agent chat functionality (requires API key)."""
    print("Testing Agent Chat...")
    
    test_cv_path = "test_chat_CV.json"
    
    # Clean up
    if os.path.exists(test_cv_path):
        os.remove(test_cv_path)
    
    try:
        agent = ElderSphereAgent(cv_path=test_cv_path)
        
        # Test a simple interaction
        response = agent.chat("Hello, I love gardening!")
        
        assert isinstance(response, str), "Response should be a string"
        assert len(response) > 0, "Response should not be empty"
        print(f"✓ Received response: {response[:100]}...")
        
        # Check if personality was updated (may take a moment)
        profile = agent.get_personality_profile()
        print(f"✓ Personality profile: {json.dumps(profile, indent=2)}")
        
        # Clean up
        if os.path.exists(test_cv_path):
            os.remove(test_cv_path)
        
        print("✅ Agent chat test passed!\n")
        
    except Exception as e:
        print(f"❌ Agent chat test failed: {e}\n")
        # Clean up
        if os.path.exists(test_cv_path):
            os.remove(test_cv_path)


def main():
    """Run all tests."""
    print("=" * 60)
    print("ElderSphere Agent Test Suite")
    print("=" * 60)
    print()
    
    # Always run CV manager tests (no API key needed)
    test_cv_manager()
    
    # Try to run agent tests (requires API key)
    agent_initialized = test_agent_initialization()
    
    if agent_initialized:
        test_agent_chat()
    
    print("=" * 60)
    print("Testing Complete!")
    print("=" * 60)


if __name__ == "__main__":
    main()
