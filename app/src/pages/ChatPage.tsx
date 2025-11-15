import { useState, useEffect } from 'react';
import { Mic, MicOff, Phone, Calendar, MapPin, Users, Send } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { VoiceWaveform } from '../components/VoiceWaveform';
import { useAppStore } from '../store/appStore';
import { callAssistant } from '../lib/aiClient';
import { buildGroundingPrompt } from '../lib/grounding';

interface ChatPageProps {
  onNavigate: (page: string) => void;
  initialMessage?: string; // For pre-seeded messages (e.g., from GroundingPage)
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export function ChatPage({ onNavigate, initialMessage }: ChatPageProps) {
  const { userProfile, memories } = useAppStore();
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm here to chat with you. How are you feeling today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputText, setInputText] = useState('');

  // Handle initial message if provided
  useEffect(() => {
    if (initialMessage && messages.length === 1) {
      handleSendMessage(initialMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const quickActions = [
    { icon: Phone, label: 'Call family', color: '#C17B6C' },
    { icon: Calendar, label: 'Daily plan', color: '#A7BFA7' },
    { icon: MapPin, label: 'Walk suggestion', color: '#7FA5B8' },
    { icon: Users, label: 'Find event', color: '#D99B5E' },
  ];

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isProcessing) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      // Build grounding prompt with user context
      const groundingPrompt = buildGroundingPrompt({
        user: userProfile,
        memories: memories,
      });

      // Combine grounding prompt with user message
      const fullPrompt = `${groundingPrompt}\n\nUser says: ${text.trim()}`;

      // Call AI assistant
      const aiResponse = await callAssistant(fullPrompt, {
        userProfile: userProfile || undefined,
        memories: memories,
      });

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error calling AI:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble right now. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuickAction = (label: string) => {
    handleSendMessage(label);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF7F2] to-[#E8DFD4] pb-32">
      <div className="px-5 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl">Your Companion</h2>
          <p className="text-xl text-[#5B4B43]">I'm listening</p>
        </div>

        {/* Voice Waveform */}
        <Card variant="default" className="mb-6">
          <VoiceWaveform isActive={isListening} />
          <div className="text-center mt-4">
            <Button
              variant={isListening ? 'emergency' : 'primary'}
              size="extra-large"
              icon={isListening ? <MicOff /> : <Mic />}
              onClick={() => {
                if (isListening) {
                  setIsListening(false);
                  // In a real app, this would process the recorded audio
                  // For now, we'll just show a placeholder
                } else {
                  setIsListening(true);
                  // In a real app, this would start recording
                }
              }}
              disabled={isProcessing}
            >
              {isListening ? 'Stop listening' : 'Start speaking'}
            </Button>
            {isProcessing && (
              <p className="text-lg text-[#5B4B43] mt-3">Eldermama is thinking...</p>
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="mb-6">
          <h3 className="mb-4 text-2xl">Quick actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Card
                  key={index}
                  variant="soft"
                  onClick={() => handleQuickAction(action.label)}
                  className="cursor-pointer text-center py-6"
                >
                  <Icon 
                    className="mx-auto mb-2" 
                    size={32} 
                    style={{ color: action.color }}
                  />
                  <p className="text-lg">{action.label}</p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Conversation */}
        <div>
          <h3 className="mb-4 text-2xl">Conversation</h3>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-3xl px-6 py-4 ${
                    message.sender === 'user'
                      ? 'bg-[#7FA5B8] text-white'
                      : 'bg-white text-[#2D2520] shadow-sm'
                  }`}
                >
                  <p className="text-xl leading-relaxed">{message.text}</p>
                  <p 
                    className={`text-sm mt-2 ${
                      message.sender === 'user' ? 'text-white/70' : 'text-[#5B4B43]/70'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Text Input */}
        <Card variant="default" className="mt-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (inputText.trim()) {
                    handleSendMessage(inputText);
                    setInputText('');
                  }
                }
              }}
              placeholder="Type a message..."
              className="flex-1 text-xl p-4 bg-transparent border-none outline-none"
              disabled={isProcessing}
            />
            <Button
              variant="primary"
              size="large"
              icon={<Send />}
              onClick={() => {
                if (inputText.trim()) {
                  handleSendMessage(inputText);
                  setInputText('');
                }
              }}
              disabled={isProcessing || !inputText.trim()}
            >
              Send
            </Button>
          </div>
        </Card>

        {/* Helper Text */}
        <Card variant="soft" className="mt-6 text-center">
          <p className="text-lg text-[#5B4B43]">
            Speak naturally or type - I'm here to listen and help
          </p>
        </Card>
      </div>
    </div>
  );
}