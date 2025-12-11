import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import alcLogo from "@/assets/alc-logo.png";

export const TopBar = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border pt-[env(safe-area-inset-top)]">
      <div className="container max-w-md mx-auto flex items-center justify-between h-14 px-4">
        <div className="flex items-center">
          <img 
            src={alcLogo} 
            alt="Adult Learning Collaboratory" 
            className="h-10 w-auto"
          />
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
