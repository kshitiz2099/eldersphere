import { Message, CompanionTag } from "@/types";

// Placeholder for future LLM integration
// Replace this with actual API calls to OpenAI/Mistral/etc.

export const generateCompanionResponse = async (
  messages: Message[],
  userProfile: any
): Promise<{ text: string; newTags?: CompanionTag[] }> => {
  // Simulate AI delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

  const lastUserMessage = messages
    .filter(m => m.sender === "user")
    .slice(-1)[0]?.text.toLowerCase() || "";

  // Simple keyword detection for demo
  const detectedTags: CompanionTag[] = [];

  if (lastUserMessage.includes("garden") || lastUserMessage.includes("plant")) {
    detectedTags.push({ label: "Gardening", source: "mentioned" });
  }
  if (lastUserMessage.includes("quiet") || lastUserMessage.includes("peaceful")) {
    detectedTags.push({ label: "Quiet spaces", source: "mentioned" });
  }
  if (lastUserMessage.includes("walk") || lastUserMessage.includes("outdoor")) {
    detectedTags.push({ label: "Walking", source: "mentioned" });
  }
  if (lastUserMessage.includes("knit") || lastUserMessage.includes("craft")) {
    detectedTags.push({ label: "Crafts", source: "mentioned" });
  }
  if (lastUserMessage.includes("shy") || lastUserMessage.includes("introvert")) {
    detectedTags.push({ label: "Introvert", source: "mentioned" });
  }

  // Generate contextual response
  let response = "";

  if (lastUserMessage.includes("circle")) {
    response = "I'd love to help you find a Circle that feels right. Based on what you've shared with me, I think you'd enjoy gentle, creative groups. Would you like me to suggest one?";
  } else if (lastUserMessage.includes("garden")) {
    response = "Gardening is such a peaceful way to connect with nature! Do you have a favorite plant or season in your garden?";
  } else if (lastUserMessage.includes("walk")) {
    response = "Morning walks can be so restorative. Do you have a favorite route or place you like to walk?";
  } else if (lastUserMessage.includes("lonely") || lastUserMessage.includes("alone")) {
    response = "I hear you. It's okay to feel that way sometimes. You're not alone here - I'm listening, and there are gentle communities waiting to welcome you when you're ready.";
  } else if (lastUserMessage.includes("memory") || lastUserMessage.includes("story")) {
    response = "I'd love to hear your story. Take your time - there's no rush. What's on your mind?";
  } else {
    // Default gentle response
    const responses = [
      "Thank you for sharing that with me. Tell me more?",
      "That sounds meaningful. How does that make you feel?",
      "I'm listening. What else is on your mind today?",
      "That's interesting. I'm here whenever you want to talk more about it.",
    ];
    response = responses[Math.floor(Math.random() * responses.length)];
  }

  return { text: response, newTags: detectedTags.length > 0 ? detectedTags : undefined };
};
