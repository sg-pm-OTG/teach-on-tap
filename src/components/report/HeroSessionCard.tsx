import { MapPin, Calendar, Users, BookOpen, Target, MessageCircle } from "lucide-react";
import { ReactNode } from "react";

interface HeroSessionCardProps {
  title: string;
  useSite: string;
  date: string;
  participants: number;
  activityType: string;
  scenarioAvg?: number;
  dialogueAvg?: number;
  trendBadges?: {
    scenario?: ReactNode;
    dialogue?: ReactNode;
  };
}

export const HeroSessionCard = ({ 
  title, 
  useSite, 
  date, 
  participants, 
  activityType,
  scenarioAvg,
  dialogueAvg,
  trendBadges,
}: HeroSessionCardProps) => {
  const details = [
    { icon: MapPin, label: "Course", value: useSite },
    { icon: Calendar, label: "Date", value: date },
    { icon: Users, label: "Participants", value: `${participants} Participants` },
    { icon: BookOpen, label: "Activity", value: activityType },
  ];

  return (
    <div className="bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <h1 className="text-xl font-bold">{title}</h1>
      </div>

      {/* Dual Score Display */}
      {(scenarioAvg !== undefined || dialogueAvg !== undefined) && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Scenario Score */}
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-orange-500/30 flex items-center justify-center">
                <Target className="h-3.5 w-3.5 text-orange-200" />
              </div>
              <span className="text-xs text-white/80">Scenario</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">{scenarioAvg?.toFixed(1)}/4</span>
              {trendBadges?.scenario}
            </div>
          </div>

          {/* Dialogue Score */}
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-teal-300/30 flex items-center justify-center">
                <MessageCircle className="h-3.5 w-3.5 text-teal-100" />
              </div>
              <span className="text-xs text-white/80">Dialogue</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">{dialogueAvg?.toFixed(1)}/4</span>
              {trendBadges?.dialogue}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {details.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-white/70">{label}</p>
              <p className="text-sm font-medium">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
