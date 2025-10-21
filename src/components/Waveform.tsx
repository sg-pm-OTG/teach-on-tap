import { cn } from "@/lib/utils";

interface WaveformProps {
  isActive?: boolean;
  className?: string;
}

export const Waveform = ({ isActive = false, className }: WaveformProps) => {
  const bars = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div className={cn("flex items-center justify-center gap-1.5", className)}>
      {bars.map((i) => (
        <div
          key={i}
          className={cn(
            "w-1 rounded-full bg-secondary transition-all",
            isActive ? "animate-wave" : "h-4"
          )}
          style={{
            height: isActive ? "24px" : "16px",
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
};
