import { PieChart, BarChart3 } from "lucide-react";

interface ChartPlaceholderProps {
  type: "pie" | "bar";
  title: string;
  description?: string;
}

export const ChartPlaceholder = ({ type, title, description }: ChartPlaceholderProps) => {
  const Icon = type === "pie" ? PieChart : BarChart3;
  
  return (
    <div className="bg-gradient-to-br from-muted/30 to-muted/50 rounded-xl p-6 border border-border">
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <h4 className="font-medium text-sm text-foreground mb-1">{title}</h4>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
};
