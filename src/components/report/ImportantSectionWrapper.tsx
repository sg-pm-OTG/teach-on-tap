import React from "react";
import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ImportantSectionWrapperProps {
  title: string;
  icon: LucideIcon;
  variant: "scenario" | "dialogue";
  badge?: string;
  children: React.ReactNode;
}

const ImportantSectionWrapper = ({
  title,
  icon: Icon,
  variant,
  badge = "Core Assessment",
  children,
}: ImportantSectionWrapperProps) => {
  const variantStyles = {
    scenario: {
      container: "bg-gradient-to-br from-orange-50/80 to-amber-50/60 dark:from-orange-950/30 dark:to-amber-950/20 border-l-4 border-l-orange-500",
      iconBg: "bg-orange-100 dark:bg-orange-900/50",
      iconColor: "text-orange-600 dark:text-orange-400",
      badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300 border-orange-200 dark:border-orange-800",
    },
    dialogue: {
      container: "bg-gradient-to-br from-teal-50/80 to-cyan-50/60 dark:from-teal-950/30 dark:to-cyan-950/20 border-l-4 border-l-teal-500",
      iconBg: "bg-teal-100 dark:bg-teal-900/50",
      iconColor: "text-teal-600 dark:text-teal-400",
      badge: "bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300 border-teal-200 dark:border-teal-800",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={`-mx-4 px-4 py-6 ${styles.container} animate-slide-in-up`}>
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 rounded-xl ${styles.iconBg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${styles.iconColor}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <Badge variant="outline" className={`text-xs font-medium ${styles.badge}`}>
              {badge}
            </Badge>
          </div>
        </div>
      </div>

      {/* Section Content */}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export default ImportantSectionWrapper;
