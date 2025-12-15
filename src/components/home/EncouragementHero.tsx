import { Sparkles, Heart, Rocket, Target, Trophy } from "lucide-react";

interface EncouragementHeroProps {
  userName: string;
  sessionCount: number;
  isFinalReportReady: boolean;
  baselineCompleted: boolean;
  masterclassAttended: boolean;
}

const getEncouragementContent = (
  sessionCount: number,
  isFinalReportReady: boolean,
  baselineCompleted: boolean,
  masterclassAttended: boolean
) => {
  if (isFinalReportReady) {
    return {
      icon: Trophy,
      title: "You did it!",
      message: "Your FOP journey is complete. Check out your Final Report to see how far you've come!",
      emoji: "🏆",
    };
  }

  if (sessionCount >= 3) {
    return {
      icon: Rocket,
      title: "You're on fire!",
      message: "Amazing progress! You're ready to complete your Post-Program Questionnaire and unlock your Final Report.",
      emoji: "🚀",
    };
  }

  if (sessionCount >= 1) {
    return {
      icon: Sparkles,
      title: "Keep the momentum going!",
      message: `${3 - sessionCount} more session${3 - sessionCount !== 1 ? 's' : ''} until you can unlock your personalized Final Report.`,
      emoji: "✨",
    };
  }

  if (masterclassAttended) {
    return {
      icon: Target,
      title: "Ready to put skills into practice!",
      message: "You've completed the masterclass. Now it's time to record your first FOP session.",
      emoji: "🎯",
    };
  }

  if (baselineCompleted) {
    return {
      icon: Heart,
      title: "Great start!",
      message: "Your baseline is recorded. Attend the masterclass to unlock session recording.",
      emoji: "💪",
    };
  }

  return {
    icon: Heart,
    title: "Welcome to your FOP journey!",
    message: "Every great teacher started exactly where you are. Let's begin with your baseline recording.",
    emoji: "🌱",
  };
};

export const EncouragementHero = ({
  userName,
  sessionCount,
  isFinalReportReady,
  baselineCompleted,
  masterclassAttended,
}: EncouragementHeroProps) => {
  const content = getEncouragementContent(
    sessionCount,
    isFinalReportReady,
    baselineCompleted,
    masterclassAttended
  );
  const Icon = content.icon;

  return (
    <div className="relative overflow-hidden rounded-2xl gradient-primary p-6 animate-slide-in-left">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative z-10">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white/80 text-sm mb-0.5">Hi {userName} {content.emoji}</p>
            <h2 className="text-xl font-bold text-white leading-tight">
              {content.title}
            </h2>
          </div>
        </div>
        <p className="text-white/90 text-sm leading-relaxed">
          {content.message}
        </p>
      </div>
    </div>
  );
};
