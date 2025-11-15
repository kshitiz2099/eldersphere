import type { UserProfile, MemoryEntry } from "../types";

/**
 * Builds a grounding prompt for the AI assistant
 * 
 * Grounding prompts help the AI provide calm, reassuring, consistent responses
 * when the user feels confused or disoriented.
 */
export function buildGroundingPrompt(opts: {
  user: UserProfile | null;
  memories: MemoryEntry[];
}): string {
  const { user, memories } = opts;

  const basicFacts = [
    user?.name && `Their name is ${user.name}.`,
    user?.preferredName && `They prefer to be called ${user.preferredName}.`,
    user?.city && `They live in ${user.city}.`,
    user?.country && `They are in ${user.country}.`,
  ].filter(Boolean).join(" ");

  const memoryFacts = memories
    .filter(m => m.type === "person" || m.type === "fact")
    .slice(0, 5)
    .map(m => `- ${m.title}: ${m.description ?? ""}`)
    .join("\n");

  return `
You are a calm, reassuring AI companion for an older adult.

Your goals:
- Reduce anxiety.
- Reassure them that they are safe.
- Gently orient them without overwhelming detail.
- Speak in short, simple sentences.
- Use their name if you know it.

Known facts:
${basicFacts || "We know very little yet about this person."}

Important people and facts:
${memoryFacts || "No specific memories are stored yet."}

Always:
- Use their name if you know it.
- Avoid medical claims.
- Never mention AI or technology unless asked.
- Keep responses brief and warm.
- Focus on safety, location, time, and people who care about them.
  `.trim();
}

