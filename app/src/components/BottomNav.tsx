import { Home, MessageCircle, Users, Settings } from "lucide-react";
import { NavLink } from "@/components/NavLink";

export const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="max-w-2xl mx-auto flex justify-around items-center py-3">
        <NavLink
          to="/"
          className="flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-colors text-muted-foreground"
          activeClassName="text-primary bg-primary/10"
        >
          <Home size={28} />
          <span className="text-sm font-medium">Home</span>
        </NavLink>
        
        <NavLink
          to="/companion"
          className="flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-colors text-muted-foreground"
          activeClassName="text-primary bg-primary/10"
        >
          <MessageCircle size={28} />
          <span className="text-sm font-medium">Companion</span>
        </NavLink>
        
        <NavLink
          to="/circles"
          className="flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-colors text-muted-foreground"
          activeClassName="text-primary bg-primary/10"
        >
          <Users size={28} />
          <span className="text-sm font-medium">Circles</span>
        </NavLink>
        
        <NavLink
          to="/settings"
          className="flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-colors text-muted-foreground"
          activeClassName="text-primary bg-primary/10"
        >
          <Settings size={28} />
          <span className="text-sm font-medium">Settings</span>
        </NavLink>
      </div>
    </nav>
  );
};
