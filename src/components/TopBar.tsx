import alcLogo from "@/assets/alc-logo.png";

export const TopBar = () => {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border pt-[max(env(safe-area-inset-top),12px)]">
      <div className="container max-w-md mx-auto flex items-center justify-center h-14 px-4">
        <div className="flex items-center gap-2">
          <img 
            src={alcLogo} 
            alt="Adult Learning Collaboratory" 
            className="h-8 w-auto"
          />
          <span className="text-lg font-semibold text-foreground">FOP Companion</span>
        </div>
      </div>
    </header>
  );
};
