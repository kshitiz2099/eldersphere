import { useState } from 'react';
import { Plus, Users, BookOpen, Calendar, X, Edit2, Heart, Sparkles } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAppStore } from '../store/appStore';
import type { MemoryEntry } from '../types';
import { callAssistant } from '../lib/aiClient';

interface MemoryPageProps {
  onNavigate: (page: string) => void;
}

type MemoryType = 'person' | 'fact' | 'event';
type MemoryCategory = 'all' | 'person' | 'fact' | 'event';

export function MemoryPage({ onNavigate }: MemoryPageProps) {
  const { memories, addMemory, updateMemory, deleteMemory, userProfile } = useAppStore();
  const [activeCategory, setActiveCategory] = useState<MemoryCategory>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    type: MemoryType;
    title: string;
    description: string;
    tags: string;
  }>({
    type: 'person',
    title: '',
    description: '',
    tags: '',
  });

  const categories = [
    { id: 'all' as MemoryCategory, icon: Heart, label: 'All' },
    { id: 'person' as MemoryCategory, icon: Users, label: 'People' },
    { id: 'fact' as MemoryCategory, icon: BookOpen, label: 'Facts' },
    { id: 'event' as MemoryCategory, icon: Calendar, label: 'Events' },
  ];

  const filteredMemories = activeCategory === 'all'
    ? memories
    : memories.filter(m => m.type === activeCategory);

  const handleSubmit = () => {
    if (!formData.title.trim()) return;

    const memoryData = {
      type: formData.type,
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      tags: formData.tags.trim() ? formData.tags.split(',').map(t => t.trim()) : undefined,
    };

    if (editingId) {
      updateMemory(editingId, memoryData);
      setEditingId(null);
    } else {
      addMemory(memoryData);
    }

    // Reset form
    setFormData({
      type: 'person',
      title: '',
      description: '',
      tags: '',
    });
    setShowAddForm(false);
  };

  const handleEdit = (memory: MemoryEntry) => {
    setEditingId(memory.id);
    setFormData({
      type: memory.type,
      title: memory.title,
      description: memory.description || '',
      tags: memory.tags?.join(', ') || '',
    });
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingId(null);
    setFormData({
      type: 'person',
      title: '',
      description: '',
      tags: '',
    });
  };

  const handleAskAI = async (memory: MemoryEntry) => {
    try {
      const prompt = `The user wants me to remind them about this memory: "${memory.title}"${memory.description ? ` - ${memory.description}` : ''}. Generate a short, reassuring phrase (1-2 sentences) that I can use to remind them about this in the future.`;
      const response = await callAssistant(prompt, {
        userProfile: userProfile || undefined,
        memories: [memory],
      });
      
      // In a real app, you might save this reminder phrase
      alert(`Eldermama says: "${response}"`);
    } catch (error) {
      console.error('Error asking AI:', error);
    }
  };

  const getTypeIcon = (type: MemoryType) => {
    switch (type) {
      case 'person':
        return Users;
      case 'fact':
        return BookOpen;
      case 'event':
        return Calendar;
    }
  };

  const getTypeColor = (type: MemoryType) => {
    switch (type) {
      case 'person':
        return '#C17B6C';
      case 'fact':
        return '#7FA5B8';
      case 'event':
        return '#A7BFA7';
    }
  };

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
        {!showAddForm && (
          <div className="mb-6">
            <Button
              variant="primary"
              size="large"
              fullWidth
              icon={<Plus />}
              onClick={() => setShowAddForm(true)}
            >
              Add a new memory
            </Button>
          </div>
        )}

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card variant="default" className="mb-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl">{editingId ? 'Edit memory' : 'Add new memory'}</h2>
                <button
                  onClick={handleCancel}
                  className="text-[#5B4B43] text-3xl leading-none"
                >
                  ×
                </button>
              </div>

              {/* Type Selection */}
              <div>
                <label className="block mb-2 text-lg">Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['person', 'fact', 'event'] as MemoryType[]).map((type) => {
                    const Icon = getTypeIcon(type);
                    return (
                      <button
                        key={type}
                        onClick={() => setFormData({ ...formData, type })}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
                          formData.type === type
                            ? 'bg-[#7FA5B8] text-white'
                            : 'bg-[#E8DFD4] text-[#2D2520]'
                        }`}
                      >
                        <Icon size={28} />
                        <span className="text-base capitalize">{type}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block mb-2 text-lg">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., My granddaughter Nora"
                  className="w-full text-xl p-4 rounded-2xl border-2 border-[#E8DFD4] focus:border-[#7FA5B8] outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block mb-2 text-lg">Description (optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add more details..."
                  rows={3}
                  className="w-full text-xl p-4 rounded-2xl border-2 border-[#E8DFD4] focus:border-[#7FA5B8] outline-none resize-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block mb-2 text-lg">Tags (optional, separated by commas)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g., family, important, weekly"
                  className="w-full text-xl p-4 rounded-2xl border-2 border-[#E8DFD4] focus:border-[#7FA5B8] outline-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="gentle"
                  size="large"
                  onClick={handleCancel}
                  fullWidth
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="large"
                  onClick={handleSubmit}
                  fullWidth
                  disabled={!formData.title.trim()}
                >
                  {editingId ? 'Save changes' : 'Add memory'}
                </Button>
              </div>
            </div>
          </Card>
        )}

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

        {/* Memory Cards */}
        <div className="space-y-5">
          {filteredMemories.map((memory) => {
            const Icon = getTypeIcon(memory.type);
            const color = getTypeColor(memory.type);

            return (
              <Card key={memory.id} variant="default">
                <div className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-2xl shrink-0"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    <Icon size={32} style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="mb-2 text-2xl">{memory.title}</h3>
                    {memory.description && (
                      <p className="text-xl text-[#5B4B43] mb-2">
                        {memory.description}
                      </p>
                    )}
                    {memory.tags && memory.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {memory.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-[#E8DFD4] text-[#5B4B43] rounded-full text-base"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-base text-[#7FA5B8]">
                      {new Date(memory.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-4">
                  <Button
                    variant="gentle"
                    size="large"
                    icon={<Edit2 />}
                    onClick={() => handleEdit(memory)}
                    fullWidth
                  >
                    Edit
                  </Button>
                  <Button
                    variant="gentle"
                    size="large"
                    icon={<Sparkles />}
                    onClick={() => handleAskAI(memory)}
                    fullWidth
                  >
                    Ask Eldermama
                  </Button>
                  <Button
                    variant="gentle"
                    size="large"
                    icon={<X />}
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this memory?')) {
                        deleteMemory(memory.id);
                      }
                    }}
                    fullWidth
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredMemories.length === 0 && !showAddForm && (
          <Card variant="soft" className="text-center py-16">
            <BookOpen className="mx-auto mb-4 text-[#7FA5B8]" size={64} />
            <h3 className="mb-3 text-2xl">No memories in this category yet</h3>
            <p className="text-xl text-[#5B4B43] mb-6">
              Add your first memory to get started
            </p>
            <Button variant="primary" size="large" icon={<Plus />} onClick={() => setShowAddForm(true)}>
              Add memory
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
