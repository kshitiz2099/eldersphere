# Narrio

Narrio is an AI-powered wellness companion and community platform designed to improve elderly wellbeing with empathetic conversation, group connection, and advanced voice/AI features.

---

## Project Overview

Narrio consists of two main parts:

- **Frontend App**: A modern React + TypeScript web app for connection, chat, and wellness.
- **Backend Agent/API**: A Gemini (Google AI)-powered companion, with voice and text chat capabilities, built with Python, FastAPI, and LangChain.

Narrio supports both text and voice conversations, group features, and intelligent suggestions.

---

## Architecture

```
Users (web)
   │
   ▼
React/Tailwind Frontend (app/)
   │  - Authentication
   │  - Group Circles
   │  - Companion Chat (text/voice)
   │
   ▼
REST + WebSocket API (Python)
   │  - Powered by Gemini LLM (Google AI)
   │  - Voice (ElevenLabs)
   │  - Memory (JSON CV)
   ▼
AI Agent (LangChain)
```

- **Frontend (app/)**: Vite, React, TypeScript, shadcn-ui, Tailwind CSS
- **Backend (backend/agent/)**: FastAPI, Python, LangChain, Gemini API, ElevenLabs, MongoDB

---

## Features

### Frontend
- Guided onboarding and profile setup
- Group "Circles" for interest-based community
- 1:1 Companion AI chat (text or voice)
- Personalized wellness suggestions
- Real-time chat with memory/personality insight
- Responsive, accessible UI with shadcn-ui and TailwindCSS
- Modern navigation with React Router

### Backend
- Gemini-powered natural, empathetic conversation
- LangChain for memory, context, and personality extraction
- Voice chat (ElevenLabs for TTS/STT)
- REST API for chat, group features, and personality
- Memory stored in CV.json (learns your life/interests)
- API endpoints for text, voice, profile, reset, greeting, and media
- WebSocket & audio streaming support

---

## Repository Structure

- `app/` - Main frontend web app (React, TypeScript)
  - `src/pages/` (Home, Circles, Companion chat, Onboarding, etc.)
  - `src/components/ui/` (Button, Chat, Voice, etc.)
  - `src/services/` (API, voice, matching logic, etc.)
- `backend/agent/` - Main backend AI agent/API
  - `agent.py` (agent logic)
  - `api.py` (REST API)
  - `CV.json` (personality / memory)
  - `services/`, `repository/`, etc.

---

## Quick Start

### Frontend (React)

```bash
cd app
npm install
npm run dev
```

Then visit [http://localhost:5173](http://localhost:5173) (or your Vite port).

### Backend (AI Agent)

```bash
cd backend/agent
# For first setup
./setup.sh
cp .env.example .env
# Add your Google Gemini API key (see API docs for details)
python agent.py # CLI conversaton mode
python api.py   # REST/voice API mode (default port 8000)
```

See `/backend/agent/QUICKSTART.md` and `/backend/agent/API_DOCS.md` for more details.

---

## API Endpoints

- `POST /chat` – Chat with Gemini agent
- `GET /personality` – Get learned personality profile
- `POST /reset` – Reset conversation
- `POST /reset-all` – Reset everything
- `GET /greeting` – Get agent welcome
- `POST /voice-chat` – (HTTP) upload audio and get text reply
- `POST /voice-chat-with-audio` – (HTTP/WebSocket) upload audio and get MP3 reply
- `POST /text-to-speech` – Convert text to audio (ElevenLabs)
See `/backend/agent/API_DOCS.md` for full reference.

---

## Tech Stack

- **Frontend**: React, Vite, TypeScript, React Router, shadcn-ui, Tailwind CSS
- **Backend**: Python 3.8+, FastAPI, LangChain, Gemini API, ElevenLabs API, MongoDB (optional)
- **Dev Tools**: eslint, prettier, etc.

---

## Contribution & Development

- To contribute, fork & PR!
- Code lives in `/app/src/` (frontend), `/backend/agent/` (backend)
- Read `/backend/agent/README.md`, `/backend/agent/PROJECT_SUMMARY.md`, `/backend/agent/API_DOCS.md` for backend details
- Read `/app/README.md` for more on frontend setup
- Follow best practices for accessibility and safety

---

## Acknowledgements

- Gemini Pro by Google, LangChain, ElevenLabs, shadcn-ui, Vite, TailwindCSS, and the open-source community.

---

## More Info

- More documentation: `/backend/agent/README.md`, `/backend/agent/PROJECT_SUMMARY.md`, `/backend/agent/API_DOCS.md`, `/app/README.md`
- For help with the Lovable platform, see their [documentation](https://docs.lovable.dev/) and [project link](https://lovable.dev/projects/71d85eb8-73e2-4a5e-a4d5-d4268cb8d0d6).
