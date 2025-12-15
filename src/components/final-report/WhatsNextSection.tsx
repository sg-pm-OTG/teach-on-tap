import { Calendar, MapPin, Rocket, BookOpen, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { eventData } from "@/data/eventData";

export const WhatsNextSection = () => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h4 className="font-medium text-foreground">What's Next?</h4>
        <p className="text-sm text-muted-foreground mt-1">
          Continue your growth journey with these next steps
        </p>
      </div>

      {/* Launch Huddle card */}
      <div className="bg-gradient-to-br from-primary to-secondary rounded-xl p-5 text-primary-foreground">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <Users className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h5 className="font-semibold text-lg">Launch Huddle</h5>
            <p className="text-sm opacity-90 mt-1">
              Join us to celebrate your achievements and connect with fellow educators!
            </p>
            
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-sm opacity-90">
                <Calendar className="h-4 w-4" />
                <span>{eventData.launchHuddle.date}</span>
              </div>
              <div className="flex items-start gap-2 text-sm opacity-90">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{eventData.launchHuddle.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next steps cards */}
      <div className="space-y-3">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Rocket className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h5 className="font-medium text-foreground text-sm">
                Keep Practicing FOP
              </h5>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Continue recording sessions to track your ongoing growth. 
                Each session builds on your skills and deepens your practice.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
              <BookOpen className="h-4 w-4 text-secondary" />
            </div>
            <div>
              <h5 className="font-medium text-foreground text-sm">
                Explore Advanced Resources
              </h5>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Dive deeper into FOP principles with additional readings, 
                case studies, and facilitation guides.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Closing message */}
      <div className="bg-muted/50 rounded-xl p-4 text-center">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Thank you for being part of this journey. Your commitment to 
          improving your practice makes a real difference in your learners' lives.
        </p>
        <p className="text-sm font-medium text-primary mt-2">
          Keep growing, keep inspiring! 🌟
        </p>
      </div>
    </div>
  );
};
