interface SpeakerCardProps {
  id: string;
  description: string;
  color?: string;
}

const colors = [
  "bg-teal-100 text-teal-700",
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-pink-100 text-pink-700",
  "bg-orange-100 text-orange-700",
  "bg-emerald-100 text-emerald-700",
  "bg-indigo-100 text-indigo-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
];

export const SpeakerCard = ({ id, description, color }: SpeakerCardProps) => {
  const colorIndex = id.charCodeAt(id.length - 1) % colors.length;
  const badgeColor = color || colors[colorIndex];

  return (
    <div className="flex items-start gap-3 p-3 bg-card rounded-xl border border-border">
      <div className={`w-10 h-10 rounded-full ${badgeColor} flex items-center justify-center flex-shrink-0`}>
        <span className="text-sm font-bold">{id.slice(0, 2)}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground mb-0.5">{id}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
};
