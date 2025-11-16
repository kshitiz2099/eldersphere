import { useApp } from "@/contexts/AppContext";
import { BottomNav } from "@/components/BottomNav";
import { CircleCard } from "@/components/CircleCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getSuggestedCircles, getCirclesByCategory } from "@/services/matchingService";
import { getUserGroups } from "@/services/userService";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { group } from "console";
import { CURRENT_USER_ID } from "@/config/constants";

const Circles = () => {
  const { userProfile, calmAnimations } = useApp();
  const navigate = useNavigate();
  const [userGroups, setUserGroups] = useState<any[]>([]);

  useEffect(() => {
    getUserGroups(CURRENT_USER_ID).then(groups => {setUserGroups(groups)});
    console.log("User Groups:", userGroups);
  }, []);

  if (!userProfile) return null;

  const suggested = getSuggestedCircles(userProfile);
  const quietCreative = getCirclesByCategory("quiet-creative");
  const outdoorsActive = getCirclesByCategory("outdoors-active");
  const storiesConversation = getCirclesByCategory("stories-conversation");

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-foreground">Circles</h1>
          <p className="text-xl text-muted-foreground">
            Small, gentle groups built around shared life and interests.
          </p>
        </div>

        {/* Find My People CTA */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={() => navigate("/circles/roulette")}
            className={`h-32 px-8 rounded-2xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all ${
              calmAnimations ? "breathe" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <Sparkles size={32} />
              <span>Find My People ✨</span>
            </div>
          </Button>
        </div>

        {/* My Groups */}
        {userGroups.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">My Groups</h2>
            <div className="space-y-4">
              {userGroups.map((group) => (
                <CircleCard
                  key={group._id || group.id}
                  circle={{
                    id: (group._id || group.id).toString(),
                    name: group.name,
                    description: group.description || '',
                    category: group.category || 'general',
                    membersCount: group.membersCount || group.members?.length || 0,
                    tags: group.tags || [],
                    matchReason: group.matchReason || ''
                  }}
                  onSelect={() => navigate(`/circles/circle-${group.id}`, { state: { groupName: group.name, groupDescription: group.description } })}
                  buttonText="Go to Chats"
                />
              ))}
            </div>
          </div>
        )}

        {/* Suggested for You */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Suggested for You</h2>
          <div className="space-y-4">
            {suggested.map((circle) => (
              <CircleCard
                key={circle.id}
                circle={circle}
                showMatchReason
                onSelect={() => navigate(`/circles/${circle.id}`)}
              />
            ))}
          </div>
        </div>

        {/* Browse by Theme */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Browse by Theme</h2>

          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-xl font-medium text-foreground">Quiet & Creative</h3>
              <div className="space-y-4">
                {quietCreative.slice(0, 2).map((circle) => (
                  <CircleCard
                    key={circle.id}
                    circle={circle}
                    onSelect={() => navigate(`/circles/${circle.id}`)}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-medium text-foreground">Outdoors & Active</h3>
              <div className="space-y-4">
                {outdoorsActive.slice(0, 2).map((circle) => (
                  <CircleCard
                    key={circle.id}
                    circle={circle}
                    onSelect={() => navigate(`/circles/${circle.id}`)}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-medium text-foreground">Stories & Conversation</h3>
              <div className="space-y-4">
                {storiesConversation.slice(0, 2).map((circle) => (
                  <CircleCard
                    key={circle.id}
                    circle={circle}
                    onSelect={() => navigate(`/circles/${circle.id}`)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Circles;
