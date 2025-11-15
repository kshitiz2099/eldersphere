export type PersonalityTag = 
  | "introvert" 
  | "extrovert" 
  | "creative" 
  | "active" 
  | "storyteller"
  | "listener"
  | "curious"
  | "gentle";

export interface UserProfile {
  id: string;
  name: string;
  age?: number;
  city?: string;
  personalityTags: PersonalityTag[];
  interests: string[];
  mobilityLevel?: "low" | "medium" | "high";
}

export interface Circle {
  id: string;
  name: string;
  description: string;
  tags: string[];
  membersCount: number;
  matchReason?: string;
  category: "quiet-creative" | "outdoors-active" | "stories-conversation" | "language-culture";
}

export interface Message {
  id: string;
  sender: "user" | "ai" | "member";
  senderName?: string;
  text: string;
  timestamp: string;
}

export interface CompanionTag {
  label: string;
  source: "mentioned" | "inferred";
}
