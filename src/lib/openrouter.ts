export async function sendMessageToOpenRouter(messages, champion) {
  const response = await fetch("https://chatbot.wuaze.com/backend/api.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [
        { role: "system", content: champion.personality },
        ...messages.map(m => ({ role: m.role, content: m.content }))
      ],
    }),
  });

  if (!response.ok) throw new Error("Failed to get response from backend");

  const data = await response.json();
  if (!data?.choices?.[0]?.message?.content) {
    const serverError = (data && (data.error || data.message)) || "Unexpected server response";
    throw new Error(typeof serverError === "string" ? serverError : JSON.stringify(serverError));
  }
  return data.choices[0].message.content;
}
