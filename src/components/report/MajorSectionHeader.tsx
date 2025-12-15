import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MajorSectionHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  accentColor: "orange" | "teal";
}

export const MajorSectionHeader = ({
  icon: Icon,
  title,
  subtitle,
  accentColor,
}: MajorSectionHeaderProps) => {
  const colorClasses = {
    orange: {
      border: "border-l-orange-500",
      bg: "bg-orange-50 dark:bg-orange-950/20",
      iconBg: "bg-orange-100 dark:bg-orange-900/40",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
    teal: {
      border: "border-l-teal-500",
      bg: "bg-teal-50 dark:bg-teal-950/20",
      iconBg: "bg-teal-100 dark:bg-teal-900/40",
      iconColor: "text-teal-600 dark:text-teal-400",
    },
  };

  const colors = colorClasses[accentColor];

  return (
    <div
      className={cn(
        "rounded-xl border border-border border-l-4 p-4 my-6",
        colors.border,
        colors.bg
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
            colors.iconBg
          )}
        >
          <Icon className={cn("h-5 w-5", colors.iconColor)} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-base">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
