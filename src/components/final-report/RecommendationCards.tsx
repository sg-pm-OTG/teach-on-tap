import { Lightbulb, Target, TrendingUp, Users } from "lucide-react";

interface Recommendation {
  title?: string;
  description?: string;
  icon?: "lightbulb" | "target" | "trending" | "users";
}

interface RecommendationCardsProps {
  recommendations: Recommendation[] | String[];
  sectionTitle?: string;
}

const iconMap = {
  lightbulb: Lightbulb,
  target: Target,
  trending: TrendingUp,
  users: Users,
};

// Default recommendations based on FOP analysis
const defaultRecommendations: Recommendation[] = [
  {
    title: "Continue Building on Your Strengths",
    description: "Your ability to create space for participant dialogue has improved significantly. Continue leveraging this in your sessions to foster deeper collaborative learning.",
    icon: "trending",
  },
  {
    title: "Explore Scenario Design Opportunities",
    description: "Consider introducing more complex, open-ended scenarios that challenge participants to think beyond immediate solutions and explore future possibilities.",
    icon: "lightbulb",
  },
  {
    title: "Deepen Facilitation Techniques",
    description: "Your talk time distribution shows healthy participant engagement. Focus on asking more probing questions to encourage even deeper reflection.",
    icon: "target",
  },
  {
    title: "Foster Peer-to-Peer Learning",
    description: "The interaction patterns suggest good cross-participant dialogue. Continue creating opportunities for participants to learn from each other's perspectives.",
    icon: "users",
  },
];

export const RecommendationCards = ({
  recommendations = defaultRecommendations,
  sectionTitle = "Recommendations for Growth",
}: RecommendationCardsProps) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-foreground">{sectionTitle}</h4>
      
      <div className="grid grid-cols-1 gap-3">
        {recommendations.map((rec, index) => {
          const Icon = iconMap[defaultRecommendations[index % 4].icon];
          return (
            <div
              key={index}
              className="bg-card rounded-xl border border-border overflow-hidden"
            >
              <div className="flex">
                {/* Accent stripe */}
                <div className="w-1 bg-gradient-to-b from-primary to-secondary flex-shrink-0" />
                
                <div className="flex-1 p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-foreground text-sm mb-1">
                        {rec?.title || ''}
                      </h5>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {rec?.description || rec}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
