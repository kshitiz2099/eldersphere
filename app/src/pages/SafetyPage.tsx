import { Phone, Shield, Cloud, Pill, Heart, MapPin, Calendar } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

interface SafetyPageProps {
  onNavigate: (page: string) => void;
}

export function SafetyPage({ onNavigate }: SafetyPageProps) {
  const emergencyContacts = [
    { name: 'Anna (Daughter)', phone: '+358 40 123 4567' },
    { name: 'Kari (Neighbor)', phone: '+358 40 234 5678' },
  ];

  const todayRoutine = [
    { time: '8:00', activity: 'Morning medication', done: true },
    { time: '10:00', activity: 'Garden time', done: true },
    { time: '14:00', activity: 'Library book club', done: false },
    { time: '18:00', activity: 'Evening medication', done: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF7F2] to-[#E8DFD4] pb-32">
      <div className="px-5 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl mb-3">Safety & Wellbeing</h1>
          <p className="text-xl text-[#5B4B43]">
            Stay healthy and connected
          </p>
        </div>

        {/* Emergency Call Section */}
        <Card variant="default" className="mb-6 border-4 border-[#B85757]/30">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-[#B85757] rounded-full flex items-center justify-center">
              <Phone className="text-white" size={40} />
            </div>
            <h2 className="mb-4 text-3xl">Need help right now?</h2>
            <Button 
              variant="emergency" 
              size="extra-large" 
              fullWidth
              icon={<Phone />}
            >
              Call for help
            </Button>
          </div>
        </Card>

        {/* Quick Contact */}
        <div className="mb-6">
          <h3 className="mb-4 text-2xl">Call someone I trust</h3>
          <div className="space-y-3">
            {emergencyContacts.map((contact, index) => (
              <Card 
                key={index}
                variant="default"
                onClick={() => {}}
                className="cursor-pointer"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="bg-[#7FA5B8] p-3 rounded-2xl shrink-0">
                      <Phone className="text-white" size={24} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl mb-1">{contact.name}</h3>
                      <p className="text-base text-[#5B4B43] truncate">{contact.phone}</p>
                    </div>
                  </div>
                  <Button variant="primary" size="large">
                    Call
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Today's Routine */}
        <div className="mb-6">
          <h3 className="mb-4 text-2xl">Today's routine</h3>
          <Card variant="default">
            <div className="space-y-3">
              {todayRoutine.map((item, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-xl ${
                    item.done ? 'bg-[#A7BFA7]/20' : 'bg-[#E8DFD4]'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-4 shrink-0 ${
                    item.done 
                      ? 'bg-[#A7BFA7] border-[#A7BFA7]' 
                      : 'border-[#7FA5B8]'
                  }`}>
                    {item.done && (
                      <div className="text-white text-center leading-none text-sm">✓</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-lg ${item.done ? 'line-through text-[#5B4B43]/70' : 'text-[#2D2520]'}`}>
                      {item.activity}
                    </p>
                    <p className="text-base text-[#5B4B43]">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Weather & Safety */}
        <div className="space-y-4 mb-6">
          <Card variant="default">
            <div className="flex items-start gap-4">
              <div className="bg-[#7FA5B8] p-3 rounded-2xl shrink-0">
                <Cloud className="text-white" size={28} />
              </div>
              <div>
                <h3 className="mb-2 text-2xl">Weather today</h3>
                <p className="text-xl text-[#5B4B43]">Partly cloudy, 18°C</p>
                <p className="text-lg text-[#5B4B43]">Good day to go out</p>
              </div>
            </div>
          </Card>

          <Card variant="default">
            <div className="flex items-start gap-4">
              <div className="bg-[#A7BFA7] p-3 rounded-2xl shrink-0">
                <Pill className="text-white" size={28} />
              </div>
              <div>
                <h3 className="mb-2 text-2xl">Next medication</h3>
                <p className="text-xl text-[#5B4B43]">6:00 PM today</p>
                <p className="text-lg text-[#5B4B43]">Evening dose</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Additional Options */}
        <div className="space-y-4">
          <Button 
            variant="gentle" 
            size="large" 
            fullWidth
            icon={<Heart />}
            onClick={() => onNavigate('grounding')}
          >
            I'm feeling confused
          </Button>

          <Button 
            variant="gentle" 
            size="large" 
            fullWidth
            icon={<Shield />}
          >
            Check in with family
          </Button>
        </div>

        {/* Privacy Note */}
        <Card variant="soft" className="mt-6 text-center">
          <Shield className="mx-auto mb-3 text-[#7FA5B8]" size={32} />
          <p className="text-lg text-[#5B4B43]">
            Location sharing is off. Your privacy is protected.
          </p>
        </Card>
      </div>
    </div>
  );
}