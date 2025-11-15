# Eldermama - Project Explanation

## Overview

**Eldermama** is a React-based web application designed as an AI companion for elderly users. The application focuses on accessibility, ease of use, and providing support for independent living through voice interaction, memory assistance, community connection, and safety features.

## Project Purpose

This is a companion application that helps elderly users:
- Stay independent and connected
- Remember important dates and people
- Find local activities and events
- Stay safe and connected with family
- Navigate daily life with voice-first interaction

The original design is from a Figma prototype: https://www.figma.com/design/3sAwloEU0554BIAw3NSqzu/Eldermama

## Technology Stack

- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS v4.1.3
- **UI Components**: Radix UI primitives (comprehensive set of accessible components)
- **Icons**: Lucide React
- **State Management**: React hooks (useState)
- **Routing**: Client-side routing via state management (no React Router)

## Project Structure

```
Eldermama/
├── src/
│   ├── App.tsx                 # Main app component with routing logic
│   ├── main.tsx                # React entry point
│   ├── index.css               # Tailwind CSS styles
│   ├── components/             # Reusable UI components
│   │   ├── Button.tsx          # Custom button component
│   │   ├── Card.tsx            # Card container component
│   │   ├── Navigation.tsx      # Bottom navigation bar
│   │   ├── BreathingGlow.tsx   # Animated breathing effect
│   │   ├── VoiceWaveform.tsx   # Voice visualization component
│   │   └── ui/                 # shadcn/ui style components (Radix UI)
│   ├── pages/                  # Page components
│   │   ├── OnboardingPage.tsx  # First-time user setup
│   │   ├── HomePage.tsx        # Main dashboard/home screen
│   │   ├── ChatPage.tsx        # AI companion chat interface
│   │   ├── GroundingPage.tsx   # Calming/orientation page
│   │   ├── MemoryPage.tsx      # Memory book/reminders
│   │   ├── CommunityPage.tsx   # Community discovery
│   │   ├── SafetyPage.tsx      # Safety & wellbeing features
│   │   ├── SettingsPage.tsx    # User settings
│   │   ├── FamilyViewPage.tsx  # Caregiver/family view
│   │   └── PersonasPage.tsx    # User personas showcase
│   └── guidelines/
│       └── Guidelines.md       # Design system guidelines (template)
├── index.html                  # HTML entry point
└── package.json               # Dependencies and scripts
```

## Key Features & Pages

### 1. Onboarding Flow (`OnboardingPage.tsx`)
Multi-step setup process for first-time users:
- Welcome screen
- Name collection (text or voice input)
- Voice test with waveform visualization
- Text size preference selection
- Privacy information
- Completion screen

### 2. Home Page (`HomePage.tsx`)
Main dashboard featuring:
- Personalized greeting with time-based messages
- Large voice interaction button (primary CTA)
- Today's weather summary
- Upcoming events/calendar
- Quick actions: "Are you feeling okay?" (grounding mode)
- Navigation to community activities and memory book

### 3. Chat Page (`ChatPage.tsx`)
AI companion conversation interface:
- Voice waveform visualization
- Start/stop listening controls
- Quick action buttons (call family, daily plan, walk suggestion, find event)
- Conversation history with timestamps
- Message bubbles (user vs AI)

### 4. Grounding Page (`GroundingPage.tsx`)
Calming/orientation page for users who may feel confused:
- Reassuring header: "Everything is okay"
- Location information ("You are at home in Espoo")
- Date and time orientation
- People who care about them
- Quick access to chat or return home

### 5. Memory Page (`MemoryPage.tsx`)
Memory book for storing and recalling important information:
- Personal memories
- Important dates
- People in their life

### 6. Community Page (`CommunityPage.tsx`)
Discovery of local activities and events:
- Community events
- Social activities
- Local resources

### 7. Safety Page (`SafetyPage.tsx`)
Safety and wellbeing features:
- Emergency contacts
- Health monitoring
- Safety check-ins

### 8. Settings Page (`SettingsPage.tsx`)
User preferences and configuration:
- Text size settings
- Voice preferences
- Privacy controls
- Family sharing settings

### 9. Family View Page (`FamilyViewPage.tsx`)
Caregiver/family member perspective:
- View of user's activity
- Health and safety status
- Communication tools

### 10. Personas Page (`PersonasPage.tsx`)
Showcase of different user personas (likely for design/demo purposes)

## Design System

### Color Palette
- **Primary Blue**: `#7FA5B8` (calm blue) - main actions, navigation
- **Green**: `#A7BFA7` - positive actions, calendar
- **Coral/Red**: `#C17B6C` - warmth, family connections
- **Emergency Red**: `#B85757` - urgent actions
- **Warm Cream**: `#FAF7F2` - background
- **Beige**: `#E8DFD4` - secondary backgrounds
- **Text Primary**: `#2D2520` - main text
- **Text Secondary**: `#5B4B43` - secondary text

### Typography
- Large, readable font sizes (1.25rem base, up to 2.5rem for headings)
- System font stack for native feel
- Generous line-height (1.6) for readability

### Component Variants

**Button Variants:**
- `primary`: Blue background (`#7FA5B8`)
- `secondary`: Green background (`#A7BFA7`)
- `gentle`: Beige background (`#E8DFD4`)
- `emergency`: Red background (`#B85757`)

**Button Sizes:**
- `large`: Standard size (4rem min-height)
- `extra-large`: Prominent CTA (5.5rem min-height)

**Card Variants:**
- `default`: White background
- `soft`: Warm cream background (`#FAF7F2`)
- `highlight`: Beige background (`#E8DFD4`)

## Navigation System

The app uses a **bottom navigation bar** (`Navigation.tsx`) with 5 main sections:
1. **Home** - Main dashboard
2. **Memories** - Memory book
3. **Community** - Activities and events
4. **Wellbeing** - Safety features
5. **Settings** - User preferences

Navigation is handled via state in `App.tsx` - there's no React Router. The app uses a simple state-based routing system where `currentPage` determines which component to render.

## Special Components

### BreathingGlow (`BreathingGlow.tsx`)
Animated pulsing effect used on the home page to draw attention to the main voice interaction button. Creates a calming, breathing-like animation.

### VoiceWaveform (`VoiceWaveform.tsx`)
Visual representation of voice input, showing animated bars that respond to audio input. Used in onboarding and chat pages.

## Accessibility Features

1. **Large Text Sizes**: All text is sized for readability (minimum 1.25rem)
2. **High Contrast**: Clear color contrast between text and backgrounds
3. **Touch-Friendly**: Large buttons and touch targets (minimum 4rem height)
4. **Voice-First**: Primary interaction method is voice, reducing typing needs
5. **Simple Navigation**: Clear, icon-based bottom navigation
6. **Reduced Motion Support**: CSS respects `prefers-reduced-motion`

## Current State

This appears to be a **prototype/demo application** with:
- Mock data and simulated interactions
- No backend integration
- No actual voice recognition (UI only)
- No real AI chat functionality
- Static content for most features

The app is designed to demonstrate the UI/UX flow and can be extended with:
- Real voice recognition (Web Speech API or similar)
- Backend API integration
- Real AI chat functionality
- Database for memories and user data
- Authentication and user accounts
- Family member accounts and sharing

## Development

**To run:**
```bash
npm install
npm run dev
```

**To build:**
```bash
npm run build
```

The app runs on Vite's development server, typically at `http://localhost:5173`.

## Design Philosophy

The application prioritizes:
1. **Simplicity**: Clean, uncluttered interfaces
2. **Accessibility**: Large text, high contrast, voice-first
3. **Calmness**: Soft colors, gentle animations, reassuring language
4. **Independence**: Tools to help users manage their own lives
5. **Connection**: Features to stay connected with family and community

## Key Patterns

- **Component-based architecture**: Reusable Button, Card components
- **Props-based navigation**: Pages receive `onNavigate` callbacks
- **State management**: React hooks for local state
- **Conditional rendering**: Pages shown/hidden based on `currentPage` state
- **Demo mode**: Menu button in top-right for quick navigation between pages during development

