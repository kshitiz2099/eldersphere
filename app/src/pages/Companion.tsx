import { useState, useRef, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Mic, Send } from "lucide-react";
import { generateCompanionResponse } from "@/services/companionService";
import type { Message } from "@/types/index";

const Companion = () => {
  const { companionMessages, addCompanionMessage, companionTags, addCompanionTags, userProfile } = useApp();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
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

  const handleMic = async () => {
    if (isRecording) {
      // Stop recording manually
      setIsRecording(false);
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    } else {
      // Start recording
      setIsRecording(true);
      audioChunksRef.current = [];

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          setIsRecording(false);
          setIsTyping(true);
          
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          
          // Send to backend and get response
          const ws = new WebSocket('ws://localhost:8000/ws/voice-chat-with-audio');
          const audioChunks: Blob[] = [];
          
          ws.onopen = async () => {
            const arrayBuffer = await audioBlob.arrayBuffer();
            ws.send(arrayBuffer);
          };

          ws.onmessage = async (event) => {
            if (typeof event.data === 'string') {
              const message = JSON.parse(event.data);
              
              if (message.type === 'transcription') {
                const userMessage: Message = {
                  id: `msg-${Date.now()}`,
                  sender: "user",
                  text: message.text,
                  timestamp: new Date().toISOString(),
                };
                addCompanionMessage(userMessage);
              } else if (message.type === 'response') {
                const aiMessage: Message = {
                  id: `msg-${Date.now()}-ai`,
                  sender: "ai",
                  text: message.text,
                  timestamp: new Date().toISOString(),
                };
                addCompanionMessage(aiMessage);
                setIsTyping(false);
              } else if (message.type === 'complete') {
                // All audio received, play it back
                if (audioChunks.length > 0) {
                  setIsPlaying(true);
                  const fullAudio = new Blob(audioChunks, { type: 'audio/mpeg' });
                  const audioUrl = URL.createObjectURL(fullAudio);
                  const audio = new Audio(audioUrl);
                  audio.playbackRate = 1.0;
                  audio.onended = () => {
                    URL.revokeObjectURL(audioUrl);
                    setIsPlaying(false);
                  };
                  audio.play().catch(console.error);
                }
                ws.close();
              }
            } else {
              // Collect audio chunks
              audioChunks.push(new Blob([event.data], { type: 'audio/mpeg' }));
            }
          };

          ws.onerror = () => {
            setIsTyping(false);
            setIsPlaying(false);
          };

          // Stop stream
          stream.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        };

        // Start recording
        mediaRecorder.start();

        // Silence detection
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        const resetTimer = () => {
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }
          silenceTimerRef.current = setTimeout(() => {
            if (mediaRecorder.state === 'recording') {
              mediaRecorder.stop();
            }
          }, 3000);
        };

        const checkAudio = () => {
          if (mediaRecorder.state !== 'recording') return;
          
          analyser.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          
          if (average > 10) {
            resetTimer();
          }
          
          requestAnimationFrame(checkAudio);
        };

        resetTimer();
        checkAudio();
      } catch (error) {
        console.error('Error accessing microphone:', error);
        setIsRecording(false);
      }
    }
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
            variant={isRecording || isPlaying ? "default" : "outline"}
            onClick={handleMic}
            disabled={isPlaying}
            className="rounded-2xl px-4"
          >
            <Mic size={24} className={isRecording || isPlaying ? "animate-pulse" : ""} />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={isRecording ? "Recording..." : isPlaying ? "Playing response..." : "Type your message..."}
            className="text-lg h-14 rounded-2xl"
            disabled={isRecording || isPlaying}
          />
          <Button
            size="lg"
            onClick={handleSend}
            disabled={!input.trim() || isRecording || isPlaying}
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
