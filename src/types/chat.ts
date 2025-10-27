export interface Champion {
  id: string;
  name: string;
  title: string;
  description: string;
  image: string;
  personality: string;
  greeting: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}
