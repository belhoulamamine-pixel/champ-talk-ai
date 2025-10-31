const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export async function sendMessageToOpenRouter(messages, champion) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: champion.personality },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    }),
  });

  if (!response.ok) throw new Error("Failed to get response from OpenRouter");

  const data = await response.json();
  return data.choices[0].message.content;
}
