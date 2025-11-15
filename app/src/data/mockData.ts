import { Circle, UserProfile, Message } from "@/types";

export const mockUserProfile: UserProfile = {
  id: "user-1",
  name: "Leena",
  age: 68,
  city: "Helsinki",
  personalityTags: ["introvert", "gentle", "creative"],
  interests: ["gardening", "knitting", "walking", "tea"],
  mobilityLevel: "medium",
};

export const mockCircles: Circle[] = [
  {
    id: "circle-1",
    name: "Tea & Stories",
    description: "Gentle daily conversations over virtual tea. Share life stories, listen, and connect.",
    tags: ["quiet", "stories", "online", "gentle"],
    membersCount: 12,
    category: "stories-conversation",
    matchReason: "You enjoy gentle conversation and listening to others' stories.",
  },
  {
    id: "circle-2",
    name: "Morning Walkers",
    description: "Share your morning walks, nature photos, and outdoor moments with fellow walkers.",
    tags: ["active", "outdoors", "morning", "photos"],
    membersCount: 18,
    category: "outdoors-active",
    matchReason: "You mentioned enjoying walks and connecting with nature.",
  },
  {
    id: "circle-3",
    name: "Knitting Corner",
    description: "Show off your latest projects, share patterns, and knit together virtually.",
    tags: ["creative", "knitting", "quiet", "crafts"],
    membersCount: 15,
    category: "quiet-creative",
    matchReason: "You love knitting and quiet creative time.",
  },
  {
    id: "circle-4",
    name: "Old Movies Club",
    description: "Weekly movie discussions, golden age cinema, and nostalgic film moments.",
    tags: ["movies", "nostalgia", "weekly", "conversation"],
    membersCount: 22,
    category: "stories-conversation",
    matchReason: "Perfect for storytellers who love classic cinema.",
  },
  {
    id: "circle-5",
    name: "Garden Friends",
    description: "Share gardening tips, plant photos, and seasonal growing advice.",
    tags: ["gardening", "outdoors", "seasonal", "photos"],
    membersCount: 28,
    category: "outdoors-active",
    matchReason: "You mentioned loving gardening and growing things.",
  },
  {
    id: "circle-6",
    name: "Poetry & Reflection",
    description: "Share poems, reflections, and gentle thoughts in a supportive space.",
    tags: ["creative", "writing", "quiet", "gentle"],
    membersCount: 9,
    category: "quiet-creative",
    matchReason: "A peaceful space for creative, introverted souls.",
  },
];

export const mockCircleMessages: Record<string, Message[]> = {
  "circle-1": [
    {
      id: "msg-1",
      sender: "member",
      senderName: "Aino",
      text: "Good morning everyone 🌿 I hope you all slept well!",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "msg-2",
      sender: "member",
      senderName: "Kari",
      text: "Morning Aino! I tried a new soup recipe yesterday - mushroom and barley. Reminded me of my grandmother's cooking.",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: "msg-3",
      sender: "member",
      senderName: "Helena",
      text: "That sounds wonderful, Kari! I'd love to hear more about your grandmother's recipes. My mother used to make the most amazing rye bread...",
      timestamp: new Date(Date.now() - 900000).toISOString(),
    },
  ],
  "circle-3": [
    {
      id: "msg-1",
      sender: "member",
      senderName: "Maija",
      text: "Just finished a scarf for my granddaughter! Used that cable pattern we talked about last week 🧶",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: "msg-2",
      sender: "member",
      senderName: "Liisa",
      text: "Beautiful work, Maija! I'm still working on those mittens - taking my time with the thumb gusset.",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
  ],
  "circle-5": [
    {
      id: "msg-1",
      sender: "member",
      senderName: "Esko",
      text: "My tomatoes are finally starting to ripen! 🍅 The late summer sun has been perfect.",
      timestamp: new Date(Date.now() - 5400000).toISOString(),
    },
    {
      id: "msg-2",
      sender: "member",
      senderName: "Raija",
      text: "Wonderful! Mine are still quite green. What variety are you growing?",
      timestamp: new Date(Date.now() - 4200000).toISOString(),
    },
  ],
};

export const mockCompanionMessages: Message[] = [
  {
    id: "ai-welcome",
    sender: "ai",
    text: "Hello! I'm ElderSphere, your companion. I'm here to listen, learn about you, and help you connect with others. What would you like to talk about today?",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const mockSuggestions = [
  {
    id: "sug-1",
    title: "Share a story from your childhood",
    icon: "BookOpen",
  },
  {
    id: "sug-2",
    title: "Check in with your family",
    icon: "Heart",
  },
  {
    id: "sug-3",
    title: "Discover a Circle you may like",
    icon: "Users",
  },
];
