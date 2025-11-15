import { useState } from 'react';
import { Calendar, MapPin, Users, Clock, Heart, Sparkles } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAppStore } from '../store/appStore';
import { callAssistant } from '../lib/aiClient';
import type { CommunityEvent } from '../types';

interface CommunityPageProps {
  onNavigate: (page: string) => void;
}

type FeelingFilter = 'calm' | 'social' | 'active' | null;
type CategoryFilter = 'social' | 'movement' | 'creative' | 'quiet' | 'all';

export function CommunityPage({ onNavigate }: CommunityPageProps) {
  const { communityEvents, userProfile } = useAppStore();
  const [feelingFilter, setFeelingFilter] = useState<FeelingFilter>(null);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [preparingForEvent, setPreparingForEvent] = useState<string | null>(null);

  const feelings = [
    { id: 'calm' as FeelingFilter, label: 'Calm and quiet', emoji: '🧘' },
    { id: 'social' as FeelingFilter, label: 'A little social', emoji: '👥' },
    { id: 'active' as FeelingFilter, label: 'Active and moving', emoji: '🚶' },
  ];

  const categories = [
    { id: 'all' as CategoryFilter, label: 'All' },
    { id: 'social' as CategoryFilter, label: 'Social' },
    { id: 'movement' as CategoryFilter, label: 'Movement' },
    { id: 'creative' as CategoryFilter, label: 'Creative' },
    { id: 'quiet' as CategoryFilter, label: 'Quiet' },
  ];

  // Filter events
  let filteredEvents = [...communityEvents];

  // Apply category filter
  if (categoryFilter !== 'all') {
    filteredEvents = filteredEvents.filter(e => e.category === categoryFilter);
  }

  // Apply feeling filter with recommendation logic
  if (feelingFilter) {
    filteredEvents = filteredEvents.map(event => ({
      ...event,
      isRecommended: getRecommendationScore(event, feelingFilter, userProfile) > 0.5,
    })).sort((a, b) => {
      // Sort recommended events first
      if (a.isRecommended && !b.isRecommended) return -1;
      if (!a.isRecommended && b.isRecommended) return 1;
      return 0;
    });
  }

  const handlePrepare = async (event: CommunityEvent) => {
    setPreparingForEvent(event.id);
    try {
      const prompt = `The user is preparing to attend this event: "${event.title}" - ${event.description}. Location: ${event.location}. Category: ${event.category}. Generate a gentle, reassuring preparation message (2-3 sentences) that helps them feel ready. Include practical tips like what to wear or bring, and reassure them that they can leave whenever they like.`;
      
      const response = await callAssistant(prompt, {
        userProfile: userProfile || undefined,
      });

      alert(`Eldermama says:\n\n${response}`);
    } catch (error) {
      console.error('Error preparing:', error);
      alert("I'm having trouble right now. The event looks great though!");
    } finally {
      setPreparingForEvent(null);
    }
  };

  const getCategoryColor = (category: CommunityEvent['category']) => {
    switch (category) {
      case 'social':
        return '#C17B6C';
      case 'movement':
        return '#A7BFA7';
      case 'creative':
        return '#7FA5B8';
      case 'quiet':
        return '#D99B5E';
    }
  };

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

        {/* Feeling Filter */}
        <div className="mb-6">
          <h3 className="mb-4 text-2xl">How would you like to feel today?</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {feelings.map((feeling) => {
              const isActive = feelingFilter === feeling.id;
              return (
                <button
                  key={feeling.id}
                  onClick={() => setFeelingFilter(isActive ? null : feeling.id)}
                  className={`flex items-center gap-2 px-6 py-4 rounded-2xl transition-all shrink-0 text-lg ${
                    isActive
                      ? 'bg-[#7FA5B8] text-white shadow-md'
                      : 'bg-white text-[#5B4B43] hover:bg-[#E8DFD4]'
                  }`}
                >
                  <span className="text-2xl">{feeling.emoji}</span>
                  <span>{feeling.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((category) => {
              const isActive = categoryFilter === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setCategoryFilter(category.id)}
                  className={`px-6 py-3 rounded-2xl transition-all text-lg shrink-0 ${
                    isActive
                      ? 'bg-[#7FA5B8] text-white shadow-md'
                      : 'bg-white text-[#5B4B43] hover:bg-[#E8DFD4]'
                  }`}
                >
                  {category.label}
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
          {filteredEvents.map((event) => {
            const categoryColor = getCategoryColor(event.category);
            const isRecommended = 'isRecommended' in event && event.isRecommended;

            return (
              <Card
                key={event.id}
                variant="default"
                className={`overflow-hidden ${isRecommended ? 'border-4 border-[#A7BFA7]' : ''}`}
              >
                {/* Recommended Badge */}
                {isRecommended && (
                  <div className="bg-[#A7BFA7] text-white px-4 py-2 text-center text-lg font-semibold mb-4">
                    ✨ Recommended for you
                  </div>
                )}

                {/* Content */}
                <div>
                  <div className="mb-4">
                    <div
                      className="inline-block text-white px-4 py-1 rounded-full text-base mb-3"
                      style={{ backgroundColor: categoryColor }}
                    >
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
                      <span>
                        {new Date(event.startsAt).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-lg text-[#5B4B43]">
                      <MapPin size={24} className="text-[#7FA5B8] shrink-0" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-lg text-[#5B4B43]">
                      <Clock size={24} className="text-[#7FA5B8] shrink-0" />
                      <span>
                        {event.distanceMinutes} minutes away
                        {event.isFree ? ' • Free' : ' • Low cost'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      variant="primary"
                      size="large"
                      fullWidth
                      onClick={() => {
                        // In a real app, this would join/RSVP
                        alert(`You've joined "${event.title}"! We'll remind you before it starts.`);
                      }}
                    >
                      Join activity
                    </Button>
                    <Button
                      variant="gentle"
                      size="large"
                      fullWidth
                      icon={<Sparkles />}
                      onClick={() => handlePrepare(event)}
                      disabled={preparingForEvent === event.id}
                    >
                      {preparingForEvent === event.id
                        ? 'Preparing...'
                        : 'Help me prepare'}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <Card variant="soft" className="text-center py-16">
            <Calendar className="mx-auto mb-4 text-[#7FA5B8]" size={64} />
            <h3 className="mb-3 text-2xl">No activities match your filters</h3>
            <p className="text-xl text-[#5B4B43] mb-6">
              Try adjusting your preferences
            </p>
            <Button
              variant="primary"
              size="large"
              onClick={() => {
                setFeelingFilter(null);
                setCategoryFilter('all');
              }}
            >
              Clear filters
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

/**
 * Calculate recommendation score based on feeling filter and user profile
 */
function getRecommendationScore(
  event: CommunityEvent,
  feeling: FeelingFilter,
  userProfile: any
): number {
  if (!feeling) return 0;

  let score = 0;

  // Match feeling to event category
  if (feeling === 'calm' && event.category === 'quiet') {
    score += 0.8;
  } else if (feeling === 'social' && event.category === 'social') {
    score += 0.8;
  } else if (feeling === 'active' && event.category === 'movement') {
    score += 0.8;
  }

  // Consider user profile preferences
  if (userProfile) {
    // Introverts might prefer quiet activities
    if (userProfile.introvertExtrovert === 'introvert' && event.category === 'quiet') {
      score += 0.3;
    }
    // Extroverts might prefer social activities
    if (userProfile.introvertExtrovert === 'extrovert' && event.category === 'social') {
      score += 0.3;
    }
    // Mobility level affects movement activities
    if (userProfile.mobilityLevel === 'low' && event.category === 'movement') {
      score -= 0.3;
    }
  }

  // Prefer nearby events
  if (event.distanceMinutes < 15) {
    score += 0.2;
  }

  // Prefer free events
  if (event.isFree) {
    score += 0.1;
  }

  return Math.min(score, 1.0);
}
