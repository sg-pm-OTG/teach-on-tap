import { Trophy, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const FinalReportHero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-secondary p-6 text-primary-foreground animate-fade-in">
      {/* Decorative sparkles */}
      <div className="absolute top-3 right-3 opacity-60">
        <Sparkles className="h-6 w-6" />
      </div>
      <div className="absolute bottom-4 left-4 opacity-40">
        <Sparkles className="h-4 w-4" />
      </div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/5 pointer-events-none" />
      
      <div className="relative space-y-4">
        {/* Trophy icon */}
        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto">
          <Trophy className="h-8 w-8 text-primary-foreground" />
        </div>
        
        {/* Content */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold">
            🎉 Your Final Report is Ready!
          </h2>
          <p className="text-sm text-primary-foreground/80">
            Your complete FOP journey analysis awaits. See how far you've come!
          </p>
        </div>
        
        {/* CTA Button */}
        <Button
          onClick={() => navigate("/final-report")}
          className="w-full bg-white hover:bg-white/90 font-semibold"
          style={{ color: 'hsl(270, 100%, 23%)' }}
          size="lg"
        >
          View My Final Report
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default FinalReportHero;
