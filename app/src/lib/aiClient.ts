/**
 * AI Client abstraction for Eldermama
 * 
 * This is a pluggable interface that can be swapped from mock to real LLM.
 * For now, it returns mock responses that simulate a calm, reassuring AI companion.
 */

export interface AIContext {
  userProfile?: {
    name?: string;
    city?: string;
    preferredName?: string;
  };
  memories?: Array<{
    type: string;
    title: string;
    description?: string;
  }>;
  [key: string]: any;
}

/**
 * Calls the AI assistant with a prompt and optional context
 * 
 * @param prompt - The full prompt to send to the AI
 * @param context - Optional context (user profile, memories, etc.)
 * @returns A promise that resolves to the AI's response
 */
export async function callAssistant(
  prompt: string,
  context?: AIContext
): Promise<string> {
  // TODO: Replace this mock with real OpenAI/Mistral/Anthropic API call
  // Example:
  // const response = await fetch('/api/chat', {
  //   method: 'POST',
  //   body: JSON.stringify({ prompt, context })
  // });
  // return response.json().text;

  // Mock implementation that simulates a calm, reassuring response
  return simulateAIResponse(prompt, context);
}

/**
 * Simulates an AI response based on the prompt
 * This is a placeholder that will be replaced with real LLM calls
 */
function simulateAIResponse(prompt: string, context?: AIContext): string {
  const lowerPrompt = prompt.toLowerCase();
  const userName = context?.userProfile?.name || context?.userProfile?.preferredName || "there";
  
  // Grounding responses
  if (lowerPrompt.includes("confused") || lowerPrompt.includes("where am i") || lowerPrompt.includes("what day")) {
    const city = context?.userProfile?.city || "your home";
    const now = new Date();
    const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
    const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    
    return `Everything is okay, ${userName}. You are safe at ${city}. Today is ${dayName}, ${dateStr}. Take a deep breath. I'm here with you.`;
  }
  
  // Memory-related responses
  if (lowerPrompt.includes("remind") || lowerPrompt.includes("memory") || lowerPrompt.includes("remember")) {
    const people = context?.memories?.filter(m => m.type === "person").slice(0, 2) || [];
    if (people.length > 0) {
      const personNames = people.map(p => p.title).join(" and ");
      return `I'll remember that for you, ${userName}. ${personNames} ${people.length === 1 ? 'is' : 'are'} important to you, and I'll keep that close.`;
    }
    return `I'm here to help you remember what matters, ${userName}. What would you like me to remember?`;
  }
  
  // Community/activity suggestions
  if (lowerPrompt.includes("activity") || lowerPrompt.includes("event") || lowerPrompt.includes("community")) {
    return `I can help you find something nice to do today, ${userName}. Would you like something quiet and calm, or something a bit more social?`;
  }
  
  // General friendly response
  const responses = [
    `I understand, ${userName}. I'm here to listen.`,
    `That sounds important, ${userName}. Tell me more.`,
    `I'm with you, ${userName}. You're not alone.`,
    `Thank you for sharing that with me, ${userName}. How can I help?`,
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

