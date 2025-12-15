import { Calendar, Users, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";

interface SessionJourneyItem {
  sessionNumber: number;
  course: string;
  date: string;
  format: string;
  durationMinutes: number;
  isBaseline: boolean;
}

interface JourneyOverviewProps {
  timeline: SessionJourneyItem[];
}

export const JourneyOverview = ({ timeline }: JourneyOverviewProps) => {
  const regularSessions = timeline.filter((s) => !s.isBaseline);

  return (
    <div className="space-y-4">
      {/* Narrative */}
      <div className="bg-muted/50 rounded-xl p-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Your FOP journey has been one of continuous growth and exploration. 
          From your baseline recording to your most recent session, you've shown 
          remarkable progress in facilitating future-oriented learning experiences.
        </p>
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">Session Timeline</h4>
        
        <div className="overflow-x-auto -mx-4 px-4">
          <div className="flex gap-3 pb-2" style={{ minWidth: "max-content" }}>
            {/* Baseline */}
            {timeline.some((s) => s.isBaseline) && (
              <div className="flex-shrink-0 w-40 bg-muted/30 rounded-xl p-3 border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-xs font-bold text-muted-foreground">B</span>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">Baseline</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {timeline.find((s) => s.isBaseline)?.course || "Initial Recording"}
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  {timeline.find((s) => s.isBaseline)?.date 
                    ? format(new Date(timeline.find((s) => s.isBaseline)!.date), "MMM d, yyyy")
                    : ""}
                </p>
              </div>
            )}

            {/* Regular sessions */}
            {regularSessions.map((session, index) => (
              <div 
                key={index}
                className="flex-shrink-0 w-44 bg-card rounded-xl p-3 border border-border shadow-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-foreground">
                      {session.sessionNumber}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-foreground">
                    Session {session.sessionNumber}
                  </span>
                </div>

                <p className="text-sm font-medium text-foreground truncate mb-2">
                  {session.course}
                </p>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(session.date), "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{session.format}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{session.durationMinutes} min</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-primary/5 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-primary">{regularSessions.length}</p>
          <p className="text-xs text-muted-foreground">Sessions</p>
        </div>
        <div className="bg-secondary/5 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-secondary">
            {regularSessions.length * 45}
          </p>
          <p className="text-xs text-muted-foreground">Total Minutes</p>
        </div>
        <div className="bg-accent/10 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-accent-foreground">
            {timeline.some((s) => s.isBaseline) ? "✓" : "—"}
          </p>
          <p className="text-xs text-muted-foreground">Baseline</p>
        </div>
      </div>
    </div>
  );
};
