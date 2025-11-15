import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { CircleCard } from "@/components/CircleCard";
import { useNavigate } from "react-router-dom";
import { mockSuggestions } from "@/data/mockData";
import { getSuggestedCircles } from "@/services/matchingService";
import { BookOpen, Heart, Users, Sparkles } from "lucide-react";

const iconMap = {
  BookOpen,
  Heart,
  Users,
};

const Home = () => {
  const { userProfile, calmAnimations } = useApp();
  const navigate = useNavigate();

  if (!userProfile) {
    navigate("/onboarding");
    return null;
  }

  const suggestedCircles = getSuggestedCircles(userProfile);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-12">
        {/* Greeting Section */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-foreground">
            {greeting}, {userProfile.name} 🌤️
          </h1>
          <p className="text-xl text-muted-foreground">
            Let's make today a little brighter.
          </p>
        </div>

        {/* Primary CTA */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={() => navigate("/companion")}
            className={`h-40 w-40 rounded-full text-xl font-semibold shadow-lg hover:shadow-xl transition-all ${
              calmAnimations ? "breathe" : ""
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <Sparkles size={36} />
              <span>Talk to<br />ElderSphere</span>
            </div>
          </Button>
        </div>

        {/* Today's Suggestions */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Today's Suggestions</h2>
          <div className="space-y-3">
            {mockSuggestions.map((suggestion) => {
              const Icon = iconMap[suggestion.icon as keyof typeof iconMap];
              return (
                <button
                  key={suggestion.id}
                  onClick={() => {
                    if (suggestion.id === "sug-3") {
                      navigate("/circles/roulette");
                    } else if (suggestion.id === "sug-1" || suggestion.id === "sug-2") {
                      navigate("/companion");
                    }
                  }}
                  className="w-full bg-card hover:bg-card/80 rounded-2xl p-6 border border-border text-left transition-colors flex items-center gap-4"
                >
                  <div className="bg-primary/10 p-3 rounded-xl">
                    <Icon size={28} className="text-primary" />
                  </div>
                  <span className="text-lg font-medium">{suggestion.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Circles You May Enjoy */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Circles You May Enjoy</h2>
          <div className="space-y-4">
            {suggestedCircles.map((circle) => (
              <CircleCard
                key={circle.id}
                circle={circle}
                onSelect={() => navigate(`/circles/${circle.id}`)}
              />
            ))}
          </div>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/circles")}
            className="w-full text-lg h-14 rounded-xl"
          >
            Browse all Circles
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;
