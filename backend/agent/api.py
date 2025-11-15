"""
API wrapper for ElderSphere Agent.
Provides a simple interface for frontend integration.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any
from agent import ElderSphereAgent
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="ElderSphere Companion Agent API",
    description="AI companion/psychotherapist for elderly wellbeing",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize agent (singleton pattern)
agent = None


def get_agent():
    """Get or create the agent instance."""
    global agent
    if agent is None:
        agent = ElderSphereAgent()
    return agent


# Pydantic models for request/response validation
class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str
    success: bool


class PersonalityResponse(BaseModel):
    personality: Dict[str, Any]
    success: bool


class MessageResponse(BaseModel):
    message: str
    success: bool


class GreetingResponse(BaseModel):
    greeting: str
    success: bool


class HealthResponse(BaseModel):
    status: str
    service: str


@app.get('/health', response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    return {
        'status': 'healthy',
        'service': 'ElderSphere Companion Agent'
    }


@app.post('/chat', response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Chat endpoint.
    
    Send a message to the agent and receive a response.
    The agent will automatically extract and store personality insights.
    """
    try:
        if not request.message.strip():
            raise HTTPException(status_code=400, detail='Message cannot be empty')
        
        # Get agent response
        agent_instance = get_agent()
        response = agent_instance.chat(request.message)
        
        return {
            'response': response,
            'success': True
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get('/personality', response_model=PersonalityResponse)
async def get_personality():
    """
    Get the current personality profile.
    
    Returns all learned personality traits, interests, and preferences.
    """
    try:
        agent_instance = get_agent()
        personality = agent_instance.get_personality_profile()
        
        return {
            'personality': personality,
            'success': True
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post('/reset', response_model=MessageResponse)
async def reset_conversation():
    """
    Reset conversation history (keeps personality data).
    
    Clears the chat history while preserving learned personality information.
    """
    try:
        agent_instance = get_agent()
        agent_instance.reset_conversation()
        
        return {
            'message': 'Conversation history reset',
            'success': True
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post('/reset-all', response_model=MessageResponse)
async def reset_all():
    """
    Reset both conversation and personality data.
    
    Completely clears all data including personality information.
    """
    try:
        agent_instance = get_agent()
        agent_instance.reset_all()
        
        return {
            'message': 'All data reset',
            'success': True
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get('/greeting', response_model=GreetingResponse)
async def get_greeting():
    """
    Get an initial greeting from the agent.
    
    Returns a warm, contextual greeting to start the conversation.
    """
    try:
        agent_instance = get_agent()
        # Generate a contextual greeting
        greeting = agent_instance.chat("Hello")
        
        return {
            'greeting': greeting,
            'success': True
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == '__main__':
    import uvicorn
    
    # Check for API key
    if not os.getenv('GOOGLE_API_KEY'):
        print("Error: GOOGLE_API_KEY not found in environment variables")
        print("Please create a .env file with your Google API key")
        exit(1)
    
    # Run the server
    print("Starting ElderSphere Agent API Server (FastAPI)...")
    print("Server running on http://localhost:8000")
    print("\nAvailable endpoints:")
    print("  GET  /health - Health check")
    print("  POST /chat - Send a message")
    print("  GET  /personality - Get personality profile")
    print("  POST /reset - Reset conversation")
    print("  POST /reset-all - Reset everything")
    print("  GET  /greeting - Get initial greeting")
    print("  GET  /docs - Interactive API documentation (Swagger UI)")
    print("  GET  /redoc - Alternative API documentation")
    print("\nPress Ctrl+C to stop the server\n")
    
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
