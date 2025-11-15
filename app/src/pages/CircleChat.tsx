import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Send, ArrowLeft } from "lucide-react";
import { mockCircles, mockCircleMessages } from "@/data/mockData";
import { Message } from "@/types";
import { useApp } from "@/contexts/AppContext";

const CircleChat = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userProfile } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const circle = mockCircles.find(c => c.id === id);

  useEffect(() => {
    if (id && mockCircleMessages[id]) {
      setMessages(mockCircleMessages[id]);
    }
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!circle) {
    navigate("/circles");
    return null;
  }

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: "user",
      senderName: userProfile?.name || "You",
      text: input,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInput("");
  };

  const handleMic = () => {
    setInput("(Pretend this was transcribed speech)");
  };

  return (
    <div className="min-h-screen pb-24 flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/circles")}
              className="rounded-full"
            >
              <ArrowLeft size={24} />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{circle.name}</h1>
              <p className="text-sm text-muted-foreground">{circle.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pinned Welcome Message */}
      <div className="max-w-2xl mx-auto w-full px-4 py-4">
        <div className="bg-secondary/30 rounded-2xl p-4 border border-secondary">
          <p className="text-base text-foreground">
            <span className="font-semibold">{userProfile?.name}, welcome! </span>
            This group loves gentle daily conversation and {circle.tags.slice(0, 2).join(" and ")}. 
            Say hello when you're ready — it's okay to just listen too.
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 ${
                message.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border"
              }`}
            >
              {message.senderName && message.sender !== "user" && (
                <p className="text-sm font-semibold mb-1 text-accent">{message.senderName}</p>
              )}
              <p className="text-lg leading-relaxed">{message.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="max-w-2xl mx-auto w-full px-4 pb-4">
        <div className="flex gap-2">
          <Button
            size="lg"
            variant="outline"
            onClick={handleMic}
            className="rounded-2xl px-4"
          >
            <Mic size={24} />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            className="text-lg h-14 rounded-2xl"
          />
          <Button
            size="lg"
            onClick={handleSend}
            disabled={!input.trim()}
            className="rounded-2xl px-6"
          >
            <Send size={24} />
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default CircleChat;
