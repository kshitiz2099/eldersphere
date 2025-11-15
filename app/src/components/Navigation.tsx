import { Home, BookHeart, Users, Shield, Settings } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'memory', icon: BookHeart, label: 'Memories' },
    { id: 'community', icon: Users, label: 'Community' },
    { id: 'safety', icon: Shield, label: 'Wellbeing' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)] border-t-2 border-[#E8DFD4] z-50">
      <div className="px-2">
        <div className="flex justify-around items-center py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-[#7FA5B8] text-white' 
                    : 'text-[#5B4B43] hover:bg-[#E8DFD4]'
                }`}
              >
                <Icon size={28} strokeWidth={2} />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}