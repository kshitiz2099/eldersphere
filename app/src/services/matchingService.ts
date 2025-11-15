import { Circle, UserProfile } from "@/types";
import { mockCircles } from "@/data/mockData";

// Placeholder for future AI matching algorithm
// Replace with actual LLM-powered matching logic

export const findMatchingCircle = (userProfile: UserProfile): Circle => {
  // Simple interest-based matching for demo
  const userInterests = userProfile.interests.map(i => i.toLowerCase());
  const userTags = userProfile.personalityTags;

  // Score each circle
  const scoredCircles = mockCircles.map(circle => {
    let score = 0;

    // Match interests
    circle.tags.forEach(tag => {
      if (userInterests.some(interest => tag.includes(interest) || interest.includes(tag))) {
        score += 3;
      }
    });

    // Match personality
    if (userTags.includes("introvert") && circle.tags.includes("quiet")) {
      score += 2;
    }
    if (userTags.includes("creative") && circle.tags.includes("creative")) {
      score += 2;
    }
    if (userTags.includes("active") && circle.tags.includes("active")) {
      score += 2;
    }

    return { circle, score };
  });

  // Sort by score and pick highest
  scoredCircles.sort((a, b) => b.score - a.score);
  return scoredCircles[0].circle;
};

export const getCirclesByCategory = (category: Circle["category"]): Circle[] => {
  return mockCircles.filter(c => c.category === category);
};

export const getSuggestedCircles = (userProfile: UserProfile): Circle[] => {
  const userInterests = userProfile.interests.map(i => i.toLowerCase());
  
  return mockCircles
    .filter(circle => 
      circle.tags.some(tag => 
        userInterests.some(interest => tag.includes(interest) || interest.includes(tag))
      )
    )
    .slice(0, 3);
};
