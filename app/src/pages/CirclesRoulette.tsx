import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { findMatchingCircle } from "@/services/matchingService";
import { Circle } from "@/types";
import { Sparkles, RefreshCw } from "lucide-react";
import { CircleCard } from "@/components/CircleCard";

const searchingPhrases = [
  "Listening to your story…",
  "Checking your interests…",
  "Finding gentle matches…",
  "Looking for your people…",
];

const CirclesRoulette = () => {
  const { userProfile, calmAnimations } = useApp();
  const navigate = useNavigate();
  const [state, setState] = useState<"idle" | "searching" | "result">("idle");
  const [matchedCircle, setMatchedCircle] = useState<Circle | null>(null);
  const [currentPhrase, setCurrentPhrase] = useState(0);

  if (!userProfile) {
    navigate("/onboarding");
    return null;
  }

  const handleFind = async () => {
    setState("searching");
    setCurrentPhrase(0);

    // Cycle through searching phrases
    const interval = setInterval(() => {
      setCurrentPhrase(prev => (prev + 1) % searchingPhrases.length);
    }, 1500);

    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 4500));
    clearInterval(interval);

    const matched = findMatchingCircle(userProfile);
    setMatchedCircle(matched);
    setState("result");
  };

  const handleAnother = () => {
    setState("idle");
    setMatchedCircle(null);
  };

  const handleJoin = () => {
    if (matchedCircle) {
      navigate(`/circles/${matchedCircle.id}`);
    }
  };

  if (state === "idle") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-background to-secondary/20">
        <div className="text-center space-y-8 max-w-lg">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground">Find Your People</h1>
            <p className="text-xl text-muted-foreground">
              Tap to let Narrio pick a Circle that fits you right now.
            </p>
          </div>
          
          <Button
            size="lg"
            onClick={handleFind}
            className={`h-48 w-48 rounded-full text-2xl font-bold shadow-2xl hover:shadow-3xl transition-all ${
              calmAnimations ? "breathe" : ""
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <Sparkles size={48} className={calmAnimations ? "pulse-glow" : ""} />
              <span>Find My<br />People ✨</span>
            </div>
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/circles")}
            className="text-lg"
          >
            Back to Circles
          </Button>
        </div>
      </div>
    );
  }

  if (state === "searching") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-background to-secondary/20">
        <div className="text-center space-y-12">
          <div className={`relative ${calmAnimations ? "animate-spin-slow" : ""}`}>
            <div className="w-32 h-32 rounded-full border-8 border-primary/30" />
            <div className="absolute top-0 left-0 w-32 h-32 rounded-full border-8 border-t-primary border-r-primary border-b-transparent border-l-transparent" />
          </div>
          
          <p className="text-2xl font-medium text-foreground animate-fade-in">
            {searchingPhrases[currentPhrase]}
          </p>
        </div>
      </div>
    );
  }

  // Result state
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-block animate-float">
            <Sparkles size={48} className="text-accent" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">We found your Circle!</h1>
        </div>

        {matchedCircle && (
          <div className="space-y-6">
            <CircleCard circle={matchedCircle} showMatchReason />

            <div className="flex gap-4">
              <Button
                size="lg"
                onClick={handleJoin}
                className="flex-1 text-xl h-16 rounded-2xl"
              >
                Join this Circle
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleAnother}
                className="flex-1 text-xl h-16 rounded-2xl"
              >
                <RefreshCw size={24} className="mr-2" />
                Show another
              </Button>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          onClick={() => navigate("/circles")}
          className="w-full text-lg"
        >
          Back to all Circles
        </Button>
      </div>
    </div>
  );
};

export default CirclesRoulette;
