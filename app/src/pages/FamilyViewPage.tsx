import { Heart, MessageCircle, Calendar, TrendingUp, Shield, Clock } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

interface FamilyViewPageProps {
  onNavigate: (page: string) => void;
}

export function FamilyViewPage({ onNavigate }: FamilyViewPageProps) {
  const activityData = [
    { day: 'Mon', engagement: 85 },
    { day: 'Tue', engagement: 72 },
    { day: 'Wed', engagement: 90 },
    { day: 'Thu', engagement: 88 },
    { day: 'Fri', engagement: 65 },
    { day: 'Sat', engagement: 78 },
    { day: 'Sun', engagement: 82 },
  ];

  const recentActivities = [
    { icon: MessageCircle, text: 'Chatted with companion about gardening', time: '2 hours ago' },
    { icon: Calendar, text: 'Joined library book club event', time: 'Yesterday' },
    { icon: Heart, text: 'Added new memory about summer house', time: '2 days ago' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF7F2] to-[#E8DFD4] pb-32">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="mb-3">Family View</h1>
          <p className="text-xl text-[#5B4B43]">
            Mari's wellbeing summary
          </p>
        </div>

        {/* Privacy Notice */}
        <Card variant="soft" className="mb-8 text-center border-2 border-[#7FA5B8]/30">
          <Shield className="mx-auto mb-3 text-[#7FA5B8]" size={40} />
          <p className="text-lg text-[#5B4B43]">
            This view respects Mari's privacy. Exact locations and personal details are never shared.
          </p>
        </Card>

        {/* Weekly Summary */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card variant="default" className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#6B9B6E]/20 rounded-2xl flex items-center justify-center">
              <Heart className="text-[#6B9B6E]" size={32} />
            </div>
            <h3 className="mb-2">Mood</h3>
            <p className="text-3xl mb-2">Good</p>
            <p className="text-base text-[#5B4B43]">Steady this week</p>
          </Card>

          <Card variant="default" className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#7FA5B8]/20 rounded-2xl flex items-center justify-center">
              <TrendingUp className="text-[#7FA5B8]" size={32} />
            </div>
            <h3 className="mb-2">Activity</h3>
            <p className="text-3xl mb-2">Active</p>
            <p className="text-base text-[#5B4B43]">5 social events</p>
          </Card>

          <Card variant="default" className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#A7BFA7]/20 rounded-2xl flex items-center justify-center">
              <MessageCircle className="text-[#A7BFA7]" size={32} />
            </div>
            <h3 className="mb-2">Engagement</h3>
            <p className="text-3xl mb-2">High</p>
            <p className="text-base text-[#5B4B43]">Daily conversations</p>
          </Card>
        </div>

        {/* Engagement Chart */}
        <div className="mb-8">
          <h3 className="mb-4">Weekly engagement</h3>
          <Card variant="default">
            <div className="flex items-end justify-between h-48 gap-2">
              {activityData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-3">
                  <div className="w-full bg-[#E8DFD4] rounded-t-xl relative" style={{ height: '100%' }}>
                    <div 
                      className="absolute bottom-0 w-full bg-[#7FA5B8] rounded-t-xl transition-all"
                      style={{ height: `${data.engagement}%` }}
                    />
                  </div>
                  <span className="text-lg text-[#5B4B43]">{data.day}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Activities */}
        <div className="mb-8">
          <h3 className="mb-4">Recent activities</h3>
          <Card variant="default">
            <div className="space-y-6">
              {recentActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className="bg-[#7FA5B8]/20 p-3 rounded-2xl shrink-0">
                      <Icon className="text-[#7FA5B8]" size={28} />
                    </div>
                    <div className="flex-1">
                      <p className="text-lg mb-1">{activity.text}</p>
                      <p className="text-base text-[#5B4B43] flex items-center gap-2">
                        <Clock size={16} />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <Button 
            variant="primary" 
            size="large" 
            fullWidth
            icon={<MessageCircle />}
          >
            Send a voice note to Mari
          </Button>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Button 
              variant="gentle" 
              size="large" 
              fullWidth
              icon={<Calendar />}
            >
              View shared calendar
            </Button>
            
            <Button 
              variant="gentle" 
              size="large" 
              fullWidth
              icon={<Shield />}
            >
              Privacy settings
            </Button>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="mt-8">
          <h3 className="mb-4">Upcoming for Mari</h3>
          <Card variant="default">
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-[#E8DFD4] rounded-xl">
                <Calendar className="text-[#7FA5B8] shrink-0" size={28} />
                <div>
                  <p className="text-lg mb-1">Library book club</p>
                  <p className="text-base text-[#5B4B43]">Thursday, 2:00 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-[#E8DFD4] rounded-xl">
                <Calendar className="text-[#7FA5B8] shrink-0" size={28} />
                <div>
                  <p className="text-lg mb-1">Walking group</p>
                  <p className="text-base text-[#5B4B43]">Saturday, 9:00 AM</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Info Box */}
        <Card variant="soft" className="mt-8 text-center">
          <p className="text-lg text-[#5B4B43]">
            This summary updates daily. Call Mari anytime to check in directly.
          </p>
        </Card>
      </div>
    </div>
  );
}
