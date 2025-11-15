import { MapPin, Calendar, Users, MessageCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

interface GroundingPageProps {
  onNavigate: (page: string) => void;
  userName?: string;
  location?: string;
}

export function GroundingPage({ 
  onNavigate, 
  userName = "Mari",
  location = "home in Espoo" 
}: GroundingPageProps) {
  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const timeOfDay = today.getHours() < 12 ? 'morning' : today.getHours() < 18 ? 'afternoon' : 'evening';
  const month = today.toLocaleDateString('en-US', { month: 'long' });
  const day = today.getDate();
  const year = today.getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#A7BFA7]/10 to-[#7FA5B8]/10 pb-32">
      <div className="px-5 py-8">
        {/* Calming Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#7FA5B8]/20 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-[#7FA5B8]/40 flex items-center justify-center">
              <div className="w-7 h-7 rounded-full bg-[#7FA5B8]" />
            </div>
          </div>
          <h1 className="mb-3 text-4xl">Everything is okay, {userName}</h1>
          <p className="text-2xl text-[#5B4B43]">Let me help you feel centered</p>
        </div>

        {/* Orientation Information */}
        <div className="space-y-5 mb-8">
          <Card variant="default" className="border-4 border-[#7FA5B8]/30">
            <div className="flex items-start gap-4">
              <div className="bg-[#7FA5B8] p-3 rounded-2xl shrink-0">
                <MapPin className="text-white" size={32} />
              </div>
              <div>
                <h2 className="mb-2 text-2xl">Where you are</h2>
                <p className="text-2xl">You are at {location}</p>
                <p className="text-xl text-[#5B4B43] mt-1">You are safe here</p>
              </div>
            </div>
          </Card>

          <Card variant="default" className="border-4 border-[#A7BFA7]/30">
            <div className="flex items-start gap-4">
              <div className="bg-[#A7BFA7] p-3 rounded-2xl shrink-0">
                <Calendar className="text-white" size={32} />
              </div>
              <div>
                <h2 className="mb-2 text-2xl">What day it is</h2>
                <p className="text-2xl">Today is {dayName} {timeOfDay}</p>
                <p className="text-xl text-[#5B4B43] mt-1">{month} {day}, {year}</p>
              </div>
            </div>
          </Card>

          <Card variant="default" className="border-4 border-[#C17B6C]/30">
            <div className="flex items-start gap-4">
              <div className="bg-[#C17B6C] p-3 rounded-2xl shrink-0">
                <Users className="text-white" size={32} />
              </div>
              <div>
                <h2 className="mb-2 text-2xl">People who care about you</h2>
                <p className="text-xl text-[#5B4B43]">Anna visits most weekends</p>
                <p className="text-xl text-[#5B4B43]">Your neighbor Kari checks in regularly</p>
                <p className="text-xl text-[#5B4B43]">I'm always here to talk with you</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button 
            variant="primary" 
            size="extra-large" 
            fullWidth
            icon={<MessageCircle />}
            onClick={() => onNavigate('chat')}
          >
            Talk to me
          </Button>
          
          <Button 
            variant="gentle" 
            size="large" 
            fullWidth
            onClick={() => onNavigate('home')}
          >
            Go back to home
          </Button>
        </div>

        {/* Reassuring Message */}
        <Card variant="soft" className="mt-6 text-center">
          <p className="text-xl">Take a deep breath. You are exactly where you should be.</p>
        </Card>
      </div>
    </div>
  );
}