import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { UserProfile, MemoryEntry, CommunityEvent } from '../types';

// Mock community events - in a real app, this would come from an API
const MOCK_COMMUNITY_EVENTS: CommunityEvent[] = [
  {
    id: '1',
    title: 'Library Book Club',
    description: 'Monthly book discussion and coffee. A quiet, friendly gathering.',
    category: 'quiet',
    location: 'Espoo Central Library',
    startsAt: '2024-01-18T14:00:00',
    isFree: true,
    distanceMinutes: 15,
  },
  {
    id: '2',
    title: 'Morning Walking Group',
    description: 'Gentle walk in the park with friendly conversation. Easy pace.',
    category: 'movement',
    location: 'Central Park',
    startsAt: '2024-01-20T09:00:00',
    isFree: true,
    distanceMinutes: 10,
  },
  {
    id: '3',
    title: 'Community Lunch',
    description: 'Shared meal and warm conversation. Everyone is welcome.',
    category: 'social',
    location: 'Community Center',
    startsAt: '2024-01-19T12:00:00',
    isFree: false,
    distanceMinutes: 20,
  },
  {
    id: '4',
    title: 'Arts & Crafts Circle',
    description: 'Painting, knitting, and creative projects. No experience needed.',
    category: 'creative',
    location: 'Senior Center',
    startsAt: '2024-01-16T15:00:00',
    isFree: true,
    distanceMinutes: 12,
  },
  {
    id: '5',
    title: 'Garden Club Meeting',
    description: 'Share gardening tips and stories. Indoor meeting in winter.',
    category: 'quiet',
    location: 'Botanical Gardens',
    startsAt: '2024-01-17T10:00:00',
    isFree: true,
    distanceMinutes: 18,
  },
  {
    id: '6',
    title: 'Coffee & Conversation',
    description: 'Casual meetup for friendly chat. Small, cozy group.',
    category: 'social',
    location: 'Cafe Cultura',
    startsAt: '2024-01-15T11:00:00',
    isFree: false,
    distanceMinutes: 8,
  },
  {
    id: '7',
    title: 'Quiet Reading Hour',
    description: 'Peaceful reading time together. Bring your own book or borrow one.',
    category: 'quiet',
    location: 'Local Library',
    startsAt: '2024-01-21T13:00:00',
    isFree: true,
    distanceMinutes: 14,
  },
  {
    id: '8',
    title: 'Gentle Yoga Class',
    description: 'Chair-based yoga for all abilities. Very gentle and relaxing.',
    category: 'movement',
    location: 'Community Center',
    startsAt: '2024-01-22T10:30:00',
    isFree: true,
    distanceMinutes: 20,
  },
];

interface AppStoreContextType {
  userProfile: UserProfile | null;
  memories: MemoryEntry[];
  communityEvents: CommunityEvent[];
  
  // Actions
  setUserProfile: (profile: UserProfile | null) => void;
  addMemory: (memory: Omit<MemoryEntry, 'id' | 'createdAt'>) => void;
  updateMemory: (id: string, memory: Partial<MemoryEntry>) => void;
  deleteMemory: (id: string) => void;
}

const AppStoreContext = createContext<AppStoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER_PROFILE: 'eldermama_user_profile',
  MEMORIES: 'eldermama_memories',
};

export function AppStoreProvider({ children }: { children?: ReactNode }) {
  // Load from localStorage on mount
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [memories, setMemoriesState] = useState<MemoryEntry[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MEMORIES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Community events are static/mock for now
  const [communityEvents] = useState<CommunityEvent[]>(MOCK_COMMUNITY_EVENTS);

  // Sync to localStorage whenever state changes
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(userProfile));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    }
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(memories));
  }, [memories]);

  const setUserProfile = (profile: UserProfile | null) => {
    setUserProfileState(profile);
  };

  const addMemory = (memory: Omit<MemoryEntry, 'id' | 'createdAt'>) => {
    const newMemory: MemoryEntry = {
      ...memory,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    setMemoriesState(prev => [...prev, newMemory]);
  };

  const updateMemory = (id: string, updates: Partial<MemoryEntry>) => {
    setMemoriesState(prev =>
      prev.map(m => (m.id === id ? { ...m, ...updates } : m))
    );
  };

  const deleteMemory = (id: string) => {
    setMemoriesState(prev => prev.filter(m => m.id !== id));
  };

  return (
    <AppStoreContext.Provider
      value={{
        userProfile,
        memories,
        communityEvents,
        setUserProfile,
        addMemory,
        updateMemory,
        deleteMemory,
      }}
    >
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppStoreContext);
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppStoreProvider');
  }
  return context;
}

