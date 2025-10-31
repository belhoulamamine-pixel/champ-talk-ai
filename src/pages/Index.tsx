import { useState, useEffect, useRef } from "react";
import { Moon, Sun, Send, Settings, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import ChampionSelector from "@/components/ChampionSelector";
import ChatMessage from "@/components/ChatMessage";
import { Champion, Message } from "@/types/chat";
import { champions } from "@/data/champions";
import { sendMessageToOpenRouter } from "@/lib/openrouter";

const Index = () => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [selectedChampion, setSelectedChampion] = useState<Champion | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showApiDialog, setShowApiDialog] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    
    // Load API key from localStorage
    const savedApiKey = localStorage.getItem("openrouter_api_key");
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, [theme]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !selectedChampion) return;

    if (!apiKey.trim()) {
      toast.error("Please set your OpenRouter API key first");
      setShowApiDialog(true);
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await sendMessageToOpenRouter(
        [...messages, userMessage],
        selectedChampion,
      );

      const championMessage: Message = {
        role: "assistant",
        content: response,
      };

      setMessages((prev) => [...prev, championMessage]);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to get response. Please check your API key.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiKeySave = (key: string) => {
    setApiKey(key);
    localStorage.setItem("openrouter_api_key", key);
    toast.success("API key saved successfully");
  };

  const handleChampionSelect = (champion: Champion) => {
    setSelectedChampion(champion);
    setMessages([
      {
        role: "assistant",
        content: champion.greeting,
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">League Champion Chat</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowApiDialog(true)}
              title="API Settings"
            >
              <Settings className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              title="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {!selectedChampion ? (
          <div className="text-center space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Chat with Your Favorite Champion</h2>
              <p className="text-muted-foreground">
                Select a League of Legends champion to start chatting
              </p>
            </div>
            <ChampionSelector
              champions={champions}
              onSelect={handleChampionSelect}
            />
          </div>
        ) : (
          <div className="grid lg:grid-cols-[300px_1fr] gap-6">
            {/* Champion Info Sidebar */}
            <Card className="p-6 h-fit space-y-4 lg:sticky lg:top-24">
              <div className="space-y-3">
                <img
                  src={selectedChampion.image}
                  alt={selectedChampion.name}
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <div>
                  <h3 className="text-xl font-bold">{selectedChampion.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedChampion.title}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedChampion.description}
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSelectedChampion(null);
                  setMessages([]);
                }}
              >
                Change Champion
              </Button>
            </Card>

            {/* Chat Area */}
            <div className="flex flex-col h-[calc(100vh-12rem)]">
              <Card className="flex-1 flex flex-col overflow-hidden">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((message, index) => (
                    <ChatMessage
                      key={index}
                      message={message}
                      championName={selectedChampion.name}
                      championImage={selectedChampion.image}
                    />
                  ))}
                  {isLoading && (
                    <div className="flex items-start gap-3 message-fade-in">
                      <img
                        src={selectedChampion.image}
                        alt={selectedChampion.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 bg-chat-champion text-chat-champion-foreground rounded-2xl rounded-tl-sm p-4">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.2s]" />
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t border-border p-4">
                  <div className="flex gap-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder={`Message ${selectedChampion.name}...`}
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={isLoading || !inputValue.trim()}
                      size="icon"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
