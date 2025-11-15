import { useState } from 'react';
import { Plus, Users, MapPin, BookOpen, Heart } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface MemoryPageProps {
  onNavigate: (page: string) => void;
}

type MemoryCategory = 'all' | 'people' | 'places' | 'stories';

export function MemoryPage({ onNavigate }: MemoryPageProps) {
  const [activeCategory, setActiveCategory] = useState<MemoryCategory>('all');

  const memories = [
    {
      id: '1',
      title: 'Anna\'s Wedding Day',
      category: 'people',
      description: 'Beautiful summer day in June 1998',
      date: 'June 1998',
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552',
    },
    {
      id: '2',
      title: 'Summer House in Saimaa',
      category: 'places',
      description: 'Where we spent every summer for 30 years',
      date: '1975-2005',
      imageUrl: 'https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9',
    },
    {
      id: '3',
      title: 'Teaching at Espoo School',
      category: 'stories',
      description: 'My 35 years as a mathematics teacher',
      date: '1968-2003',
      imageUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45',
    },
    {
      id: '4',
      title: 'My Daughter Anna',
      category: 'people',
      description: 'Born March 1972, now living in Helsinki',
      date: 'March 1972',
      imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
    },
    {
      id: '5',
      title: 'Garden in Spring',
      category: 'places',
      description: 'The tulips I planted with my late husband',
      date: 'Every Spring',
      imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946',
    },
    {
      id: '6',
      title: 'Book Club Memories',
      category: 'stories',
      description: 'Meeting friends every month for 20 years',
      date: '2003-present',
      imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66',
    },
  ];

  const categories = [
    { id: 'all' as MemoryCategory, icon: Heart, label: 'All' },
    { id: 'people' as MemoryCategory, icon: Users, label: 'People' },
    { id: 'places' as MemoryCategory, icon: MapPin, label: 'Places' },
    { id: 'stories' as MemoryCategory, icon: BookOpen, label: 'Stories' },
  ];

  const filteredMemories = activeCategory === 'all' 
    ? memories 
    : memories.filter(m => m.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF7F2] to-[#E8DFD4] pb-32">
      <div className="px-5 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl mb-3">Your Memory Book</h1>
          <p className="text-xl text-[#5B4B43]">
            The stories and people that matter most
          </p>
        </div>

        {/* Add Memory Button */}
        <div className="mb-6">
          <Button
            variant="primary"
            size="large"
            fullWidth
            icon={<Plus />}
            onClick={() => {}}
          >
            Add a new memory
          </Button>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl transition-all shrink-0 ${
                    isActive
                      ? 'bg-[#7FA5B8] text-white shadow-md'
                      : 'bg-white text-[#5B4B43] hover:bg-[#E8DFD4]'
                  }`}
                >
                  <Icon size={24} />
                  <span className="text-lg">{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Memory Cards Grid */}
        <div className="space-y-5">
          {filteredMemories.map((memory) => (
            <Card 
              key={memory.id} 
              variant="default"
              onClick={() => {}}
              className="cursor-pointer overflow-hidden"
            >
              <div className="aspect-video rounded-xl overflow-hidden mb-4">
                <ImageWithFallback
                  src={memory.imageUrl}
                  alt={memory.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="mb-2 text-2xl">{memory.title}</h3>
                <p className="text-xl text-[#5B4B43] mb-2">
                  {memory.description}
                </p>
                <p className="text-lg text-[#7FA5B8]">
                  {memory.date}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredMemories.length === 0 && (
          <Card variant="soft" className="text-center py-16">
            <BookOpen className="mx-auto mb-4 text-[#7FA5B8]" size={64} />
            <h3 className="mb-3 text-2xl">No memories in this category yet</h3>
            <p className="text-xl text-[#5B4B43] mb-6">
              Add your first memory to get started
            </p>
            <Button variant="primary" size="large" icon={<Plus />}>
              Add memory
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}