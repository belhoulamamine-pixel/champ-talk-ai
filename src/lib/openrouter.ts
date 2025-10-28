import { Champion, Message } from "@/types/chat";

// Load API key from Vite environment variables
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;


export async function sendMessageToOpenRouter(
  messages: Message[],
  champion: Champion
): Promise<string> {
  const systemMessage = {
    role: "system",
    content: champion.personality,
  };

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": window.location.origin,
    },
body: JSON.stringify({
  model: "gpt-4o-mini", // ✅ working
  messages: [systemMessage, ...messages.map(msg => ({ role: msg.role, content: msg.content }))],
})

  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || "Failed to get response from OpenRouter");
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
