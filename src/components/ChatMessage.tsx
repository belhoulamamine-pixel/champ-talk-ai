import { Message } from "@/types/chat";
import { User } from "lucide-react";

interface ChatMessageProps {
  message: Message;
  championName: string;
  championImage: string;
}

const ChatMessage = ({ message, championName, championImage }: ChatMessageProps) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex items-start gap-3 message-fade-in ${
        isUser ? "flex-row-reverse" : ""
      }`}
    >
      {isUser ? (
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6 text-primary-foreground" />
        </div>
      ) : (
        <img
          src={championImage}
          alt={championName}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />
      )}
      <div
        className={`flex-1 max-w-[80%] rounded-2xl p-4 ${
          isUser
            ? "bg-chat-user text-chat-user-foreground rounded-tr-sm"
            : "bg-chat-champion text-chat-champion-foreground rounded-tl-sm"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
