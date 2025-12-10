import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendBadgeProps {
  currentValue: number;
  previousValue: number;
  precision?: number;
  size?: "sm" | "md";
}

export const TrendBadge = ({
  currentValue,
  previousValue,
  precision = 1,
  size = "sm",
}: TrendBadgeProps) => {
  const diff = currentValue - previousValue;
  const isPositive = diff > 0;
  const isNegative = diff < 0;
  const isNeutral = diff === 0;

  const formattedDiff = Math.abs(diff).toFixed(precision);
  
  const sizeClasses = size === "sm" 
    ? "text-[10px] px-1.5 py-0.5 gap-0.5" 
    : "text-xs px-2 py-1 gap-1";
  
  const iconSize = size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        sizeClasses,
        isPositive && "bg-emerald-100 text-emerald-700",
        isNegative && "bg-rose-100 text-rose-700",
        isNeutral && "bg-muted text-muted-foreground"
      )}
    >
      {isPositive && <ArrowUp className={iconSize} />}
      {isNegative && <ArrowDown className={iconSize} />}
      {isNeutral && <Minus className={iconSize} />}
      {isNeutral ? "0" : formattedDiff}
    </span>
  );
};
