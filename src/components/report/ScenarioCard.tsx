import { FileText } from "lucide-react";

interface ScenarioCardProps {
  title: string;
  content: string[];
}

export const ScenarioCard = ({ title, content }: ScenarioCardProps) => {
  return (
    <div className="bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 rounded-2xl p-5 border border-orange-200/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center shadow-sm">
          <FileText className="h-5 w-5 text-orange-600" />
        </div>
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      <div className="space-y-3">
        {content.flat().map((paragraph, index) => (
          <p key={index} className="text-sm text-foreground leading-relaxed list-item ml-5">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
};
