import { MapPin, Calendar, Users, BookOpen, Target, MessageCircle } from "lucide-react";

interface TopMarker {
  label: string;
  score: number;
}

interface HeroSessionCardProps {
  title: string;
  useSite: string;
  date: string;
  participants: number;
  activityType: string;
  topScenarioMarkers?: TopMarker[];
  topDialogueMarkers?: TopMarker[];
}

export const HeroSessionCard = ({ 
  title, 
  useSite, 
  date, 
  participants, 
  activityType,
  topScenarioMarkers = [],
  topDialogueMarkers = [],
}: HeroSessionCardProps) => {
  const details = [
    { icon: MapPin, label: "Course", value: useSite },
    { icon: Calendar, label: "Date", value: date },
    { icon: Users, label: "Participants", value: `${participants} Participants` },
    { icon: BookOpen, label: "Activity", value: activityType },
  ];

  const truncateLabel = (label: string, maxLength: number = 14) => {
    return label.length > maxLength ? label.slice(0, maxLength) + "…" : label;
  };

  return (
    <div className="bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <h1 className="text-xl font-bold">{title}</h1>
      </div>

      {/* Top Performing Markers Display */}
      {(topScenarioMarkers.length > 0 || topDialogueMarkers.length > 0) && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Scenario Top Markers */}
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-orange-500/30 flex items-center justify-center">
                <Target className="h-3.5 w-3.5 text-orange-200" />
              </div>
              <span className="text-xs text-white/80">Top Scenario</span>
            </div>
            <div className="space-y-1.5">
              {topScenarioMarkers.map((marker, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-xs text-white/90 truncate mr-2">
                    {truncateLabel(marker.label)}
                  </span>
                  <span className="text-xs font-semibold bg-white/20 px-1.5 py-0.5 rounded">
                    {Math.round(marker.score)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Dialogue Top Markers */}
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-teal-300/30 flex items-center justify-center">
                <MessageCircle className="h-3.5 w-3.5 text-teal-100" />
              </div>
              <span className="text-xs text-white/80">Top Dialogue</span>
            </div>
            <div className="space-y-1.5">
              {topDialogueMarkers.map((marker, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-xs text-white/90 truncate mr-2">
                    {truncateLabel(marker.label)}
                  </span>
                  <span className="text-xs font-semibold bg-white/20 px-1.5 py-0.5 rounded">
                    {Math.round(marker.score)}
                  </span>
                </div>
              ))}
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
