import { Mic, Sun, Cloud, Calendar, Heart } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { BreathingGlow } from '../components/BreathingGlow';

interface HomePageProps {
  onNavigate: (page: string) => void;
  userName?: string;
}

export function HomePage({ onNavigate, userName = "Mari" }: HomePageProps) {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';
  
  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const monthDay = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF7F2] to-[#E8DFD4] pb-32">
      <div className="px-5 py-6">
        {/* Greeting */}
        <div className="text-center mb-6">
          <h1 className="mb-2 text-4xl">{greeting}, {userName}</h1>
          <p className="text-xl text-[#5B4B43]">{dayName}, {monthDay}</p>
        </div>

        {/* Main Voice Button */}
        <div className="mb-6">
          <div className="mb-4">
            <BreathingGlow />
          </div>
          <Button 
            variant="primary" 
            size="extra-large" 
            fullWidth
            icon={<Mic />}
            onClick={() => onNavigate('chat')}
          >
            Speak to Your Companion
          </Button>
        </div>

        {/* Today's Summary */}
        <div className="space-y-4 mb-6">
          <Card variant="default">
            <div className="flex items-start gap-4">
              <div className="bg-[#7FA5B8] p-3 rounded-2xl shrink-0">
                <Sun className="text-white" size={28} />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl">Today's Weather</h3>
                <p className="text-xl">Partly cloudy, 18°C</p>
                <p className="text-lg text-[#5B4B43]">Good day for a walk in the park</p>
              </div>
            </div>
          </Card>

          <Card variant="default">
            <div className="flex items-start gap-4">
              <div className="bg-[#A7BFA7] p-3 rounded-2xl shrink-0">
                <Calendar className="text-white" size={28} />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl">Coming Up</h3>
                <p className="text-xl">Library book club at 2:00 PM</p>
                <p className="text-lg text-[#5B4B43]">Walking group on Saturday morning</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <Button 
            variant="gentle" 
            size="large" 
            fullWidth
            icon={<Heart />}
            onClick={() => onNavigate('grounding')}
          >
            Are you feeling okay?
          </Button>
          
          <div className="grid grid-cols-2 gap-4">
            <Card 
              variant="soft" 
              onClick={() => onNavigate('community')}
              className="text-center py-6"
            >
              <Users className="mx-auto mb-2 text-[#7FA5B8]" size={36} />
              <h3 className="text-xl">Find Activities</h3>
            </Card>
            
            <Card 
              variant="soft" 
              onClick={() => onNavigate('memory')}
              className="text-center py-6"
            >
              <BookHeart className="mx-auto mb-2 text-[#A7BFA7]" size={36} />
              <h3 className="text-xl">Your Memories</h3>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Import icons at the top
import { Users, BookHeart } from 'lucide-react';