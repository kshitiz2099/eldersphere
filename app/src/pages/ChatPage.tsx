import { useState } from 'react';
import { Mic, MicOff, Phone, Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { VoiceWaveform } from '../components/VoiceWaveform';

interface ChatPageProps {
  onNavigate: (page: string) => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export function ChatPage({ onNavigate }: ChatPageProps) {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm here to chat with you. How are you feeling today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);

  const quickActions = [
    { icon: Phone, label: 'Call family', color: '#C17B6C' },
    { icon: Calendar, label: 'Daily plan', color: '#A7BFA7' },
    { icon: MapPin, label: 'Walk suggestion', color: '#7FA5B8' },
    { icon: Users, label: 'Find event', color: '#D99B5E' },
  ];

  const handleQuickAction = (label: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: label,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages([...messages, newMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `I'll help you with "${label}". Let me gather that information for you.`,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
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
              onClick={() => setIsListening(!isListening)}
            >
              {isListening ? 'Stop listening' : 'Start speaking'}
            </Button>
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

        {/* Helper Text */}
        <Card variant="soft" className="mt-6 text-center">
          <p className="text-lg text-[#5B4B43]">
            Speak naturally - I'm here to listen and help
          </p>
        </Card>
      </div>
    </div>
  );
}