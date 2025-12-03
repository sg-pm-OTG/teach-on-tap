import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CollapsibleSectionProps {
  title: string;
  score?: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const getScoreBadge = (score: number) => {
  const colors: Record<number, string> = {
    4: "bg-blue-100 text-blue-700",
    3: "bg-emerald-100 text-emerald-700",
    2: "bg-amber-100 text-amber-700",
    1: "bg-orange-100 text-orange-700",
    0: "bg-gray-100 text-gray-600",
  };
  const labels: Record<number, string> = {
    4: "Effective",
    3: "Visible",
    2: "Developing",
    1: "Weak",
    0: "Not Evident",
  };
  return { color: colors[score] || colors[0], label: labels[score] || labels[0] };
};

export const CollapsibleSection = ({ title, score, children, defaultOpen = false }: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const badge = score !== undefined ? getScoreBadge(score) : null;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="bg-card rounded-xl border border-border overflow-hidden">
      <CollapsibleTrigger className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="font-medium text-sm text-foreground truncate">{title}</span>
          {badge && (
            <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0", badge.color)}>
              {badge.label}
            </span>
          )}
        </div>
        <ChevronDown className={cn(
          "h-4 w-4 text-muted-foreground transition-transform flex-shrink-0",
          isOpen && "rotate-180"
        )} />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-4">
        <div className="pt-2 border-t border-border">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};