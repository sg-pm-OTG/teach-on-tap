import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeCardProps {
  title: string;
  icon: LucideIcon;
  bullets: string[];
  accentColor: string;
}

export const ThemeCard = ({ title, icon: Icon, bullets, accentColor }: ThemeCardProps) => {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className={cn("px-4 py-3 flex items-center gap-3", accentColor)}>
        <div className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center">
          <Icon className="h-4 w-4 text-foreground" />
        </div>
        <h3 className="font-semibold text-sm text-foreground">{title}</h3>
      </div>
      <div className="p-4">
        <ul className="space-y-2">
          {bullets.map((bullet, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
              <span className="leading-relaxed">{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
