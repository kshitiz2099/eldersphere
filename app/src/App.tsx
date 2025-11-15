import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { GroundingPage } from './pages/GroundingPage';
import { ChatPage } from './pages/ChatPage';
import { MemoryPage } from './pages/MemoryPage';
import { CommunityPage } from './pages/CommunityPage';
import { SafetyPage } from './pages/SafetyPage';
import { SettingsPage } from './pages/SettingsPage';
import { FamilyViewPage } from './pages/FamilyViewPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { PersonasPage } from './pages/PersonasPage';
import { Menu } from 'lucide-react';
import { Card } from './components/Card';

type Page = 'onboarding' | 'home' | 'grounding' | 'chat' | 'memory' | 'community' | 'safety' | 'settings' | 'family' | 'personas';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('onboarding');
  const [showModeSelector, setShowModeSelector] = useState(false);

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    setShowModeSelector(false);
  };

  const handleOnboardingComplete = () => {
    setCurrentPage('home');
  };

  // Mode selector for demo purposes
  const ModeSelector = () => {
    if (!showModeSelector) {
      return (
        <button
          onClick={() => setShowModeSelector(true)}
          className="fixed top-4 right-4 z-50 bg-white p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all"
        >
          <Menu size={24} className="text-[#7FA5B8]" />
        </button>
      );
    }

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-md mt-16 mb-8">
          <Card variant="default" className="w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl">Demo Navigation</h2>
              <button
                onClick={() => setShowModeSelector(false)}
                className="text-[#5B4B43] text-4xl leading-none"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg text-[#7FA5B8] mb-3">Main Screens</h3>
              {[
                { id: 'onboarding', label: 'Onboarding Flow' },
                { id: 'home', label: 'Home / Voice Hub' },
                { id: 'grounding', label: 'Grounding Mode' },
                { id: 'chat', label: 'AI Companion Chat' },
                { id: 'memory', label: 'Memory Book' },
                { id: 'community', label: 'Community Discovery' },
                { id: 'safety', label: 'Safety & Wellbeing' },
                { id: 'settings', label: 'Settings' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all ${
                    currentPage === item.id
                      ? 'bg-[#7FA5B8] text-white'
                      : 'bg-[#E8DFD4] text-[#2D2520] hover:bg-[#D9CFC0]'
                  }`}
                >
                  <p className="text-lg">{item.label}</p>
                </button>
              ))}

              <h3 className="text-lg text-[#C17B6C] mb-3 mt-6">Additional Views</h3>
              {[
                { id: 'family', label: 'Family View (Caregiver Mode)' },
                { id: 'personas', label: 'User Personas' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all ${
                    currentPage === item.id
                      ? 'bg-[#C17B6C] text-white'
                      : 'bg-[#E8DFD4] text-[#2D2520] hover:bg-[#D9CFC0]'
                  }`}
                >
                  <p className="text-lg">{item.label}</p>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      <ModeSelector />
      
      {currentPage === 'onboarding' && <OnboardingPage onComplete={handleOnboardingComplete} />}
      {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
      {currentPage === 'grounding' && <GroundingPage onNavigate={handleNavigate} />}
      {currentPage === 'chat' && <ChatPage onNavigate={handleNavigate} />}
      {currentPage === 'memory' && <MemoryPage onNavigate={handleNavigate} />}
      {currentPage === 'community' && <CommunityPage onNavigate={handleNavigate} />}
      {currentPage === 'safety' && <SafetyPage onNavigate={handleNavigate} />}
      {currentPage === 'settings' && <SettingsPage onNavigate={handleNavigate} />}
      {currentPage === 'family' && <FamilyViewPage onNavigate={handleNavigate} />}
      {currentPage === 'personas' && <PersonasPage />}

      {currentPage !== 'onboarding' && currentPage !== 'personas' && (
        <Navigation 
          currentPage={currentPage} 
          onNavigate={handleNavigate} 
        />
      )}
    </div>
  );
}