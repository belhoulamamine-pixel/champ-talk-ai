import { Champion, Message } from "@/types/chat";

export async function sendMessageToOpenRouter(
  messages: Message[],
  champion: Champion,
  apiKey: string
): Promise<string> {
  const systemMessage = {
    role: "system",
    content: champion.personality,
  };

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": window.location.origin,
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3.1-8b-instruct:free",
      messages: [
        systemMessage,
        ...messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || "Failed to get response from OpenRouter");
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
