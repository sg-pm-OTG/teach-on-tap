interface TalkTimeBarProps {
  speaker: string;
  percentage: number;
  seconds: number;
  color: string;
}

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
};

export const TalkTimeBar = ({ speaker, percentage, seconds, color }: TalkTimeBarProps) => {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium text-muted-foreground w-24 truncate">{speaker}</span>
      <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-foreground w-24 text-right">
        {percentage}% • {formatTime(seconds)}
      </span>
    </div>
  );
};
