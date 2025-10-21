import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export const MetricCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
}: MetricCardProps) => {
  return (
    <Card className={cn("p-4 border-2 hover:border-primary/50 transition-all animate-slide-in-up", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold text-foreground mb-1">{value}</p>
          {subtitle && (
            <p
              className={cn(
                "text-xs font-medium",
                trend === "up" && "text-success",
                trend === "down" && "text-destructive",
                !trend && "text-muted-foreground"
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-lg gradient-secondary flex items-center justify-center flex-shrink-0 ml-2">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};
