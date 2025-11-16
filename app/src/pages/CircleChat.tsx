import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Send, ArrowLeft } from "lucide-react";
import { Message } from "@/types";
import { useApp } from "@/contexts/AppContext";
import { getGroupChats, getUserName, addMessageToGroup } from "@/services/userService";
import { CURRENT_USER_ID } from "@/config/constants";

const CircleChat = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [groupData, setGroupData] = useState<any>(null);
  const [userName, setUserName] = useState<string>("");
  const [input, setInput] = useState("");
  const [nextMessageId, setNextMessageId] = useState<number>(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getUserName(CURRENT_USER_ID).then(setUserName);
  }, []);

  useEffect(() => {
    if (id) {
      const groupId = id.startsWith('circle-') ? id.replace('circle-', '') : id;
      const { groupName, groupDescription } = location.state || {};
      
      setGroupData({
        name: groupName || `Group ${groupId}`,
        description: groupDescription || "Group chat",
        tags: []
      });
      
      getGroupChats(Number(groupId)).then((chatData: any) => {
        console.log("Chat data received:", chatData);
        const chatMessages = chatData.messages || [];
        const formattedMessages: Message[] = chatMessages.map((msg: any) => ({
          id: msg.id,
          sender: msg.sender === CURRENT_USER_ID ? "user" : "other",
          senderName: msg.senderName || "Unknown",
          text: msg.text,
          timestamp: msg.timestamp || new Date().toISOString()
        }));
        setMessages(formattedMessages);
        
        // Set next message ID
        if (chatMessages.length > 0) {
          const maxId = Math.max(...chatMessages.map((msg: any) => msg.id));
          setNextMessageId(maxId + 1);
        }
      });
    }
  }, [id, location.state]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !id) return;

    const groupId = id.startsWith('circle-') ? id.replace('circle-', '') : id;
    const timestamp = new Date().toISOString();
    
    const messageData = {
      id: nextMessageId,
      sender: CURRENT_USER_ID,
      senderName: userName || "You",
      text: input.trim(),
      timestamp: timestamp
    };

    // Send to backend
    const success = await addMessageToGroup(Number(groupId), messageData);
    
    if (success) {
      // Add to UI
      const newMessage: Message = {
        id: nextMessageId,
        sender: "user",
        senderName: userName || "You",
        text: input.trim(),
        timestamp: timestamp,
      };

      setMessages(prev => [...prev, newMessage]);
      setNextMessageId(prev => prev + 1);
      setInput("");
    }
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
              <h1 className="text-2xl font-bold text-foreground">
                {groupData?.name || "Group Chat"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {groupData?.description || ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pinned Welcome Message */}
      {groupData && (
        <div className="max-w-2xl mx-auto w-full px-4 py-4">
          <div className="bg-secondary/30 rounded-2xl p-4 border border-secondary">
            <p className="text-base text-foreground">
              <span className="font-semibold">{userName}, welcome! </span>
              Say hello when you're ready — it's okay to just listen too.
            </p>
          </div>
        </div>
      )}

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
