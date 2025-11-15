import { useState } from 'react';
import { Calendar, MapPin, Users, Clock, Heart } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface CommunityPageProps {
  onNavigate: (page: string) => void;
}

type TimeFilter = 'today' | 'week' | 'nearby';

export function CommunityPage({ onNavigate }: CommunityPageProps) {
  const [activeFilter, setActiveFilter] = useState<TimeFilter>('week');

  const events = [
    {
      id: '1',
      title: 'Library Book Club',
      location: 'Espoo Central Library',
      date: 'Thursday, 2:00 PM',
      category: 'Reading',
      description: 'Monthly book discussion and coffee',
      imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66',
      spots: 8,
    },
    {
      id: '2',
      title: 'Morning Walking Group',
      location: 'Central Park',
      date: 'Saturday, 9:00 AM',
      category: 'Exercise',
      description: 'Gentle walk and social time',
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
      spots: 12,
    },
    {
      id: '3',
      title: 'Community Lunch',
      location: 'Community Center',
      date: 'Friday, 12:00 PM',
      category: 'Social',
      description: 'Shared meal and conversation',
      imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
      spots: 20,
    },
    {
      id: '4',
      title: 'Arts & Crafts Circle',
      location: 'Senior Center',
      date: 'Tuesday, 3:00 PM',
      category: 'Creative',
      description: 'Painting, knitting, and creative projects',
      imageUrl: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b',
      spots: 10,
    },
    {
      id: '5',
      title: 'Garden Club Meeting',
      location: 'Botanical Gardens',
      date: 'Wednesday, 10:00 AM',
      category: 'Nature',
      description: 'Share gardening tips and stories',
      imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b',
      spots: 15,
    },
    {
      id: '6',
      title: 'Coffee & Conversation',
      location: 'Cafe Cultura',
      date: 'Every Monday, 11:00 AM',
      category: 'Social',
      description: 'Casual meetup for friendly chat',
      imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348',
      spots: 6,
    },
  ];

  const filters = [
    { id: 'today' as TimeFilter, label: 'Today' },
    { id: 'week' as TimeFilter, label: 'This week' },
    { id: 'nearby' as TimeFilter, label: 'Nearby' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF7F2] to-[#E8DFD4] pb-32">
      <div className="px-5 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl mb-3">Find Activities</h1>
          <p className="text-xl text-[#5B4B43]">
            Connect with your community
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {filters.map((filter) => {
              const isActive = activeFilter === filter.id;
              
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-6 py-3 rounded-2xl transition-all text-lg shrink-0 ${
                    isActive
                      ? 'bg-[#7FA5B8] text-white shadow-md'
                      : 'bg-white text-[#5B4B43] hover:bg-[#E8DFD4]'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Info Card */}
        <Card variant="soft" className="mb-6 text-center">
          <p className="text-lg text-[#5B4B43]">
            All activities are free or low-cost and beginner-friendly
          </p>
        </Card>

        {/* Event Cards */}
        <div className="space-y-5">
          {events.map((event) => (
            <Card 
              key={event.id}
              variant="default"
              className="overflow-hidden"
            >
              {/* Image */}
              <div className="aspect-video rounded-xl overflow-hidden mb-4">
                <ImageWithFallback
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div>
                <div className="mb-4">
                  <div className="inline-block bg-[#A7BFA7] text-white px-4 py-1 rounded-full text-base mb-3">
                    {event.category}
                  </div>
                  <h3 className="mb-2 text-2xl">{event.title}</h3>
                  <p className="text-xl text-[#5B4B43] mb-4">
                    {event.description}
                  </p>
                </div>

                <div className="space-y-2 mb-5">
                  <div className="flex items-center gap-3 text-lg text-[#5B4B43]">
                    <Calendar size={24} className="text-[#7FA5B8] shrink-0" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-lg text-[#5B4B43]">
                    <MapPin size={24} className="text-[#7FA5B8] shrink-0" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-lg text-[#5B4B43]">
                    <Users size={24} className="text-[#7FA5B8] shrink-0" />
                    <span>{event.spots} people interested</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button variant="primary" size="large" fullWidth>
                    Join activity
                  </Button>
                  <Button variant="gentle" size="large" fullWidth>
                    Get details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}