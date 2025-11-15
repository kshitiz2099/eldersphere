import { useState } from 'react';
import { Type, Volume2, Shield, Bell, Users, ChevronRight } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

interface SettingsPageProps {
  onNavigate: (page: string) => void;
}

export function SettingsPage({ onNavigate }: SettingsPageProps) {
  const [textSize, setTextSize] = useState(2);
  const [voiceSpeed, setVoiceSpeed] = useState(1);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const textSizes = ['Small', 'Medium', 'Large', 'Extra Large'];
  const voiceSpeeds = ['Slow', 'Normal', 'Fast'];

  const trustedContacts = [
    { name: 'Anna (Daughter)', relationship: 'Family' },
    { name: 'Kari (Neighbor)', relationship: 'Friend' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF7F2] to-[#E8DFD4] pb-32">
      <div className="px-5 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl mb-3">Settings</h1>
          <p className="text-xl text-[#5B4B43]">
            Make the app work for you
          </p>
        </div>

        {/* Text Size */}
        <div className="mb-6">
          <h3 className="mb-4 flex items-center gap-3 text-2xl">
            <Type className="text-[#7FA5B8]" size={28} />
            Text size
          </h3>
          <Card variant="default">
            <div className="space-y-3">
              {textSizes.map((size, index) => (
                <button
                  key={index}
                  onClick={() => setTextSize(index)}
                  className={`w-full p-4 rounded-xl text-left transition-all ${
                    textSize === index
                      ? 'bg-[#7FA5B8] text-white'
                      : 'bg-[#E8DFD4] text-[#2D2520] hover:bg-[#D9CFC0]'
                  }`}
                >
                  <p className={`${
                    index === 0 ? 'text-base' :
                    index === 1 ? 'text-lg' :
                    index === 2 ? 'text-xl' : 'text-2xl'
                  }`}>
                    {size}
                  </p>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Voice Speed */}
        <div className="mb-6">
          <h3 className="mb-4 flex items-center gap-3 text-2xl">
            <Volume2 className="text-[#7FA5B8]" size={28} />
            Voice speed
          </h3>
          <Card variant="default">
            <div className="space-y-3">
              {voiceSpeeds.map((speed, index) => (
                <button
                  key={index}
                  onClick={() => setVoiceSpeed(index)}
                  className={`w-full p-4 rounded-xl text-left transition-all ${
                    voiceSpeed === index
                      ? 'bg-[#7FA5B8] text-white'
                      : 'bg-[#E8DFD4] text-[#2D2520] hover:bg-[#D9CFC0]'
                  }`}
                >
                  <p className="text-xl">{speed}</p>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Privacy Controls */}
        <div className="mb-6">
          <h3 className="mb-4 flex items-center gap-3 text-2xl">
            <Shield className="text-[#7FA5B8]" size={28} />
            Privacy
          </h3>
          <Card variant="default">
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl mb-1">Location sharing</h3>
                  <p className="text-base text-[#5B4B43]">
                    Allow family to see general location
                  </p>
                </div>
                <button className="w-14 h-8 bg-[#E8DFD4] rounded-full p-1 transition-colors shrink-0">
                  <div className="w-6 h-6 bg-white rounded-full shadow-sm" />
                </button>
              </div>

              <div className="border-t-2 border-[#E8DFD4] pt-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl mb-1">Activity updates</h3>
                    <p className="text-base text-[#5B4B43]">
                      Share daily summary with family
                    </p>
                  </div>
                  <button className="w-14 h-8 bg-[#7FA5B8] rounded-full p-1 transition-colors shrink-0">
                    <div className="w-6 h-6 bg-white rounded-full shadow-sm translate-x-6" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Notifications */}
        <div className="mb-6">
          <h3 className="mb-4 flex items-center gap-3 text-2xl">
            <Bell className="text-[#7FA5B8]" size={28} />
            Notifications
          </h3>
          <Card variant="default">
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl mb-1">Reminders</h3>
                  <p className="text-base text-[#5B4B43]">
                    Daily routine and medication
                  </p>
                </div>
                <button 
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`w-14 h-8 rounded-full p-1 transition-colors shrink-0 ${
                    notificationsEnabled ? 'bg-[#7FA5B8]' : 'bg-[#E8DFD4]'
                  }`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${
                    notificationsEnabled ? 'translate-x-6' : ''
                  }`} />
                </button>
              </div>

              <div className="border-t-2 border-[#E8DFD4] pt-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl mb-1">Event reminders</h3>
                    <p className="text-base text-[#5B4B43]">
                      Community activities and events
                    </p>
                  </div>
                  <button className="w-14 h-8 bg-[#7FA5B8] rounded-full p-1 transition-colors shrink-0">
                    <div className="w-6 h-6 bg-white rounded-full shadow-sm translate-x-6" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Trusted Contacts */}
        <div className="mb-6">
          <h3 className="mb-4 flex items-center gap-3 text-2xl">
            <Users className="text-[#7FA5B8]" size={28} />
            Trusted contacts
          </h3>
          <Card variant="default">
            <div className="space-y-3">
              {trustedContacts.map((contact, index) => (
                <button
                  key={index}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-[#E8DFD4] hover:bg-[#D9CFC0] transition-colors text-left"
                >
                  <div>
                    <p className="text-xl mb-1">{contact.name}</p>
                    <p className="text-base text-[#5B4B43]">{contact.relationship}</p>
                  </div>
                  <ChevronRight className="text-[#7FA5B8]" size={24} />
                </button>
              ))}
              <Button variant="gentle" size="large" fullWidth>
                Add trusted contact
              </Button>
            </div>
          </Card>
        </div>

        {/* Help Section */}
        <Card variant="soft" className="text-center">
          <h3 className="mb-3 text-2xl">Need help with settings?</h3>
          <p className="text-lg text-[#5B4B43] mb-6">
            Ask your companion or call a trusted contact for assistance
          </p>
          <Button 
            variant="primary" 
            size="large"
            onClick={() => onNavigate('chat')}
          >
            Talk to companion
          </Button>
        </Card>
      </div>
    </div>
  );
}