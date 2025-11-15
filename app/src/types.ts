export type UserProfile = {
  id: string;
  name: string;
  preferredName?: string;
  city?: string;
  country?: string;
  timezone?: string;
  introvertExtrovert?: "introvert" | "extrovert" | "ambivert" | null;
  mobilityLevel?: "low" | "medium" | "high" | null;
};

export type MemoryEntry = {
  id: string;
  type: "person" | "fact" | "event";
  title: string;
  description?: string;
  tags?: string[];
  createdAt: string;
};

export type CommunityEvent = {
  id: string;
  title: string;
  description: string;
  category: "social" | "movement" | "creative" | "quiet";
  location: string;
  startsAt: string;
  isFree: boolean;
  distanceMinutes: number; // fake for demo
};

