import { cn } from "@/lib/utils";

interface InteractionGridProps {
  interactions: number[][];
  labels: string[];
}

const getIntensityColor = (value: number, maxValue: number) => {
  if (value === 0) return "bg-muted/30";
  const intensity = value / maxValue;
  if (intensity > 0.7) return "bg-teal-500";
  if (intensity > 0.5) return "bg-teal-400";
  if (intensity > 0.3) return "bg-teal-300";
  if (intensity > 0.1) return "bg-teal-200";
  return "bg-teal-100";
};

export const InteractionGrid = ({ interactions, labels }: InteractionGridProps) => {
  const maxValue = Math.max(...interactions.flat());

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <h4 className="font-medium text-sm text-foreground mb-4">Speaker Interaction Heatmap</h4>
      <p className="text-xs text-muted-foreground mb-4">
        Shows frequency of interactions between speakers. Darker colors indicate more interactions.
      </p>
      
      <div className="overflow-x-auto -mx-2 px-2">
        <div className="inline-block min-w-full">
          {/* Header row */}
          <div className="flex gap-1 mb-1">
            <div className="w-8 h-6" /> {/* Empty corner cell */}
            {labels.map((label) => (
              <div
                key={label}
                className="w-8 h-6 flex items-center justify-center text-[10px] font-medium text-muted-foreground"
              >
                {label}
              </div>
            ))}
          </div>
          
          {/* Data rows */}
          {interactions.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1 mb-1">
              <div className="w-8 h-8 flex items-center justify-center text-[10px] font-medium text-muted-foreground">
                {labels[rowIndex]}
              </div>
              {row.map((value, colIndex) => (
                <div
                  key={colIndex}
                  className={cn(
                    "w-8 h-8 rounded flex items-center justify-center text-[10px] font-medium transition-colors",
                    rowIndex === colIndex ? "bg-muted/20" : getIntensityColor(value, maxValue),
                    value > maxValue * 0.5 ? "text-white" : "text-foreground/70"
                  )}
                  title={`${labels[rowIndex]} ↔ ${labels[colIndex]}: ${value} interactions`}
                >
                  {rowIndex !== colIndex ? value : "—"}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-border">
        <span className="text-[10px] text-muted-foreground">Low</span>
        <div className="flex gap-0.5">
          <div className="w-4 h-3 rounded-sm bg-teal-100" />
          <div className="w-4 h-3 rounded-sm bg-teal-200" />
          <div className="w-4 h-3 rounded-sm bg-teal-300" />
          <div className="w-4 h-3 rounded-sm bg-teal-400" />
          <div className="w-4 h-3 rounded-sm bg-teal-500" />
        </div>
        <span className="text-[10px] text-muted-foreground">High</span>
      </div>
    </div>
  );
};