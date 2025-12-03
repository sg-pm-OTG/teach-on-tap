import { cn } from "@/lib/utils";

interface CircularProgressProps {
  value: number;
  maxValue?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  color?: "primary" | "secondary" | "success" | "warning";
  className?: string;
}

export const CircularProgress = ({
  value,
  maxValue = 4,
  size = 80,
  strokeWidth = 8,
  label,
  color = "primary",
  className,
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = (value / maxValue) * 100;
  const offset = circumference - (percentage / 100) * circumference;

  const colorMap = {
    primary: "hsl(215 80% 30%)",
    secondary: "hsl(180 70% 45%)",
    success: "hsl(140 70% 45%)",
    warning: "hsl(38 92% 50%)",
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(215 20% 90%)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colorMap[color]}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="flex items-baseline">
          <span className="text-base font-bold text-foreground">{value.toFixed(1)}</span>
          <span className="text-[10px] text-muted-foreground ml-0.5">/{maxValue}</span>
        </div>
        {label && <span className="text-[9px] text-muted-foreground">{label}</span>}
      </div>
    </div>
  );
};