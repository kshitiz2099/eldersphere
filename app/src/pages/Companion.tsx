import { useState, useRef, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Mic, Send } from "lucide-react";
import { generateCompanionResponse } from "@/services/companionService";
import { Message } from "@/types";

const Companion = () => {
  const { companionMessages, addCompanionMessage, companionTags, addCompanionTags, userProfile } = useApp();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [companionMessages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: input,
      timestamp: new Date().toISOString(),
    };

    addCompanionMessage(userMessage);
    setInput("");
    setIsTyping(true);

    try {
      const response = await generateCompanionResponse([...companionMessages, userMessage], userProfile);
      
      const aiMessage: Message = {
        id: `msg-${Date.now()}-ai`,
        sender: "ai",
        text: response.text,
        timestamp: new Date().toISOString(),
      };

      addCompanionMessage(aiMessage);
      
      if (response.newTags) {
        addCompanionTags(response.newTags);
      }
    } catch (error) {
      console.error("Error generating response:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
  };

  const handleMic = () => {
    // Placeholder for voice input
    const fakeMessage = "(Pretend this was transcribed speech)";
    setInput(fakeMessage);
  };

  return (
    <div className="min-h-screen pb-24 flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-3">
          <div>
            <h1 className="text-3xl font-bold text-foreground">ElderSphere Companion</h1>
            <p className="text-base text-muted-foreground">
              Private conversation, just between you and me.
            </p>
          </div>
          
          {companionTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {companionTags.map((tag) => (
                <Badge
                  key={tag.label}
                  variant="secondary"
                  className="text-sm px-3 py-1 rounded-full"
                >
                  {tag.label}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-6">
        {companionMessages.map((message) => (
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
              <p className="text-lg leading-relaxed">{message.text}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-muted-foreground animate-pulse" />
                <div className="w-3 h-3 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: "0.2s" }} />
                <div className="w-3 h-3 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="max-w-2xl mx-auto w-full px-4 pb-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction("I'd like to share a memory from my past")}
            className="rounded-full text-base h-10"
          >
            Share a memory
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction("How am I doing today?")}
            className="rounded-full text-base h-10"
          >
            How am I doing today?
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction("Can you suggest a Circle for me?")}
            className="rounded-full text-base h-10"
          >
            Suggest a Circle
          </Button>
        </div>

        {/* Input */}
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

export default Companion;
