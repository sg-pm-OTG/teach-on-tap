import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const TopBar = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container max-w-md mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 gradient-accent rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-primary-foreground font-bold text-lg">F</span>
          </div>
          <span className="font-semibold text-lg text-primary">FOP Companion</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/notifications")}
            className="relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => navigate("/profile")}>
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
