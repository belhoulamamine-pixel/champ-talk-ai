import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { sendToOpenAI } from "./api";
async function handleSend(message) {
  const response = await sendToOpenAI([
    { role: "user", content: message }
  ]);

  console.log(response);
}

createRoot(document.getElementById("root")!).render(<App />);
