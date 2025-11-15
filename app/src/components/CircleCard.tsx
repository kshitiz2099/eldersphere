import { Circle } from "@/types";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CircleCardProps {
  circle: Circle;
  onSelect?: () => void;
  showMatchReason?: boolean;
}

export const CircleCard = ({ circle, onSelect, showMatchReason }: CircleCardProps) => {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
      <div className="space-y-4">
        <div>
          <h3 className="text-2xl font-semibold text-foreground mb-2">{circle.name}</h3>
          <p className="text-lg text-muted-foreground">{circle.description}</p>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <Users size={20} />
          <span className="text-base">{circle.membersCount} people</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {circle.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-base px-3 py-1 rounded-full"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {showMatchReason && circle.matchReason && (
          <div className="bg-secondary/30 rounded-xl p-4 border border-secondary">
            <p className="text-base text-foreground">
              <span className="font-semibold">Why this Circle? </span>
              {circle.matchReason}
            </p>
          </div>
        )}

        {onSelect && (
          <Button
            onClick={onSelect}
            size="lg"
            className="w-full text-lg h-14 rounded-xl"
          >
            See details
          </Button>
        )}
      </div>
    </div>
  );
};
