interface TalkTimeBarProps {
  speaker: string;
  percentage: number;
  color: string;
}

export const TalkTimeBar = ({ speaker, percentage, color }: TalkTimeBarProps) => {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium text-muted-foreground w-20 truncate">{speaker}</span>
      <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-foreground w-10 text-right">{percentage}%</span>
    </div>
  );
};
