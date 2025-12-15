import { MapPin, Calendar, Users, BookOpen, Star } from "lucide-react";
import { ReactNode } from "react";

interface HeroSessionCardProps {
  title: string;
  useSite: string;
  date: string;
  participants: number;
  activityType: string;
  overallScore?: number;
  trendBadge?: ReactNode;
}

export const HeroSessionCard = ({ 
  title, 
  useSite, 
  date, 
  participants, 
  activityType,
  overallScore,
  trendBadge,
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
        {overallScore !== undefined && (
          <div className="flex items-center gap-2">
            <div className="bg-white/20 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-bold">{overallScore}/4</span>
            </div>
            {trendBadge}
          </div>
        )}
      </div>
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