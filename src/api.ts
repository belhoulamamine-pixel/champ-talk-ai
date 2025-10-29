const API_URL = "https://chatbot.wuaze.com/backend/api.php"; // 👈 replace with your PHP backend URL

export async function sendToOpenAI(messages) {
  const body = {
    model: "gpt-3.5-turbo",
    messages,
  };

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Network response was not ok");
  }

  return await res.json();
}
