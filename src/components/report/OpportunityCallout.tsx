import { Quote, Lightbulb } from "lucide-react";

interface OpportunityCalloutProps {
  speaker: string;
  quote: string;
  observation: string;
  opportunity: string;
}

export const OpportunityCallout = ({ speaker, quote, observation, opportunity }: OpportunityCalloutProps) => {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200/50">
      <div className="flex items-start gap-2 mb-3">
        <Quote className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">{speaker}</span>
          <p className="text-sm text-foreground mt-2 italic leading-relaxed">"{quote}"</p>
        </div>
      </div>
      
      <div className="space-y-2 mt-3 pt-3 border-t border-amber-200/50">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Observation</p>
          <p className="text-sm text-foreground leading-relaxed">{observation}</p>
        </div>
        <div className="flex items-start gap-2 bg-white/60 rounded-lg p-2">
          <Lightbulb className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-amber-700 uppercase tracking-wide mb-1">Opportunity</p>
            <p className="text-sm text-foreground leading-relaxed">{opportunity}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
