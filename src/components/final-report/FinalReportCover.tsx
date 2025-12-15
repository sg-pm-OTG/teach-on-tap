import { useProfile } from "@/hooks/useProfile";
import alcLogo from "@/assets/alc-logo.png";

export const FinalReportCover = () => {
  const { profile } = useProfile();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent p-6 text-primary-foreground">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/20 blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/20 blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center space-y-4">
        {/* Logo */}
        <img 
          src={alcLogo} 
          alt="Adult Learning Collaboratory" 
          className="h-12 w-auto brightness-0 invert opacity-90"
        />

        {/* Title */}
        <div className="space-y-2 animate-fade-in">
          <p className="text-sm font-medium opacity-80 uppercase tracking-wider">
            Your Journey with
          </p>
          <h1 className="text-2xl font-bold leading-tight">
            Future-Oriented Pedagogies
          </h1>
        </div>

        {/* User name */}
        <div className="pt-4 border-t border-white/20 w-full">
          <p className="text-lg font-semibold">
            {profile?.name || "Teacher"}'s Final Report
          </p>
        </div>
      </div>
    </div>
  );
};
