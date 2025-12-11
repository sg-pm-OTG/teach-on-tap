import { Home, Mic, FileText, Bell } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Mic, label: "Record", path: "/record" },
    { icon: FileText, label: "Reports", path: "/reports" },
    { icon: Bell, label: "Alerts", path: "/notifications" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t border-border z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="container max-w-md mx-auto">
        <div className="grid grid-cols-4 gap-1 px-2 py-2 pb-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all min-h-[56px] active:scale-95",
                  isActive
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Icon className={cn("h-6 w-6 mb-1", isActive && "text-primary")} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
