import alcLogo from "@/assets/alc-logo.png";

export const TopBar = () => {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border pt-[max(env(safe-area-inset-top),12px)]">
      <div className="container max-w-md mx-auto relative flex items-center h-14 px-4">
        <img 
          src={alcLogo} 
          alt="Adult Learning Collaboratory" 
          className="h-6 w-auto"
        />
        <span className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          FOP Companion
        </span>
      </div>
    </header>
  );
};
