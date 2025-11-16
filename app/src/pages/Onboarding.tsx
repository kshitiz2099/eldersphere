import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/contexts/AppContext";
import { PersonalityTag } from "@/types";
import { Badge } from "@/components/ui/badge";

const interests = [
  "Gardening", "Walking", "Knitting", "Cooking", "Music", 
  "Stories", "Games", "Faith", "Volunteering", "Reading",
  "Crafts", "Movies", "Nature", "Tea"
];

const personalityOptions: { label: string; tag: PersonalityTag }[] = [
  { label: "Small groups", tag: "gentle" },
  { label: "One-on-one", tag: "introvert" },
  { label: "Just listening", tag: "listener" },
  { label: "I'm shy but curious", tag: "curious" },
  { label: "I love telling stories", tag: "storyteller" },
  { label: "I'm very active", tag: "active" },
  { label: "I'm creative", tag: "creative" },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { setUserProfile } = useApp();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedPersonality, setSelectedPersonality] = useState<PersonalityTag[]>([]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const togglePersonality = (tag: PersonalityTag) => {
    setSelectedPersonality(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleComplete = () => {
    setUserProfile({
      id: "user-1",
      name,
      personalityTags: selectedPersonality,
      interests: selectedInterests.map(i => i.toLowerCase()),
    });
    navigate("/");
  };

  if (step === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-background to-secondary/20">
        <div className="text-center space-y-8 max-w-lg">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-foreground">Welcome to Narrio</h1>
            <p className="text-xl text-muted-foreground">
              A gentle space for connection, conversation, and community.
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => setStep(1)}
            className="text-xl h-16 px-12 rounded-2xl"
          >
            Get Started
          </Button>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-lg space-y-8">
          <div className="space-y-4 text-center">
            <h2 className="text-4xl font-bold text-foreground">What should I call you?</h2>
            <p className="text-lg text-muted-foreground">Just your first name is perfect.</p>
          </div>
          <div className="space-y-6">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="text-2xl h-16 rounded-2xl text-center"
            />
            <Button
              size="lg"
              onClick={() => setStep(2)}
              disabled={!name.trim()}
              className="w-full text-xl h-16 rounded-2xl"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl space-y-8">
          <div className="space-y-4 text-center">
            <h2 className="text-4xl font-bold text-foreground">What do you enjoy?</h2>
            <p className="text-lg text-muted-foreground">Select all that interest you.</p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {interests.map((interest) => (
              <Badge
                key={interest}
                onClick={() => toggleInterest(interest)}
                variant={selectedInterests.includes(interest) ? "default" : "outline"}
                className="text-lg px-6 py-3 cursor-pointer rounded-full transition-colors"
              >
                {interest}
              </Badge>
            ))}
          </div>
          <Button
            size="lg"
            onClick={() => setStep(3)}
            disabled={selectedInterests.length === 0}
            className="w-full text-xl h-16 rounded-2xl"
          >
            Next
          </Button>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl space-y-8">
          <div className="space-y-4 text-center">
            <h2 className="text-4xl font-bold text-foreground">How do you like to spend time?</h2>
            <p className="text-lg text-muted-foreground">Help us understand you better.</p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {personalityOptions.map((option) => (
              <Badge
                key={option.tag}
                onClick={() => togglePersonality(option.tag)}
                variant={selectedPersonality.includes(option.tag) ? "default" : "outline"}
                className="text-lg px-6 py-3 cursor-pointer rounded-full transition-colors"
              >
                {option.label}
              </Badge>
            ))}
          </div>
          <Button
            size="lg"
            onClick={() => setStep(4)}
            disabled={selectedPersonality.length === 0}
            className="w-full text-xl h-16 rounded-2xl"
          >
            Next
          </Button>
        </div>
      </div>
    );
  }

  // Step 4: Summary
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-lg space-y-8">
        <div className="space-y-4 text-center">
          <h2 className="text-4xl font-bold text-foreground">Perfect, {name}!</h2>
          <div className="bg-card rounded-2xl p-8 border border-border space-y-4">
            <p className="text-xl text-foreground">
              You're a {selectedPersonality.includes("gentle") || selectedPersonality.includes("introvert") ? "gentle" : "curious"}{" "}
              {selectedPersonality.includes("introvert") ? "introvert" : "person"} who loves{" "}
              {selectedInterests.slice(0, 2).join(" and ").toLowerCase()}.
            </p>
            <p className="text-lg text-muted-foreground">
              We'll help you find warm communities that feel just right.
            </p>
          </div>
        </div>
        <Button
          size="lg"
          onClick={handleComplete}
          className="w-full text-xl h-16 rounded-2xl"
        >
          Go to Home
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
