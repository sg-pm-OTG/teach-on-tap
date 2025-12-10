import { useMemo, useState, useEffect } from "react";
import { chord, ribbon, ChordGroup } from "d3-chord";
import { arc } from "d3-shape";
import { descending } from "d3-array";

interface InteractionChordDiagramProps {
  interactions: number[][];
  labels: string[];
}

const SPEAKER_COLORS = [
  "hsl(var(--primary))",
  "hsl(17, 87%, 59%)",
  "hsl(168, 76%, 42%)",
  "hsl(45, 93%, 47%)",
  "hsl(280, 65%, 60%)",
  "hsl(200, 70%, 50%)",
];

export const InteractionChordDiagram = ({ interactions, labels }: InteractionChordDiagramProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isAnimated, setIsAnimated] = useState(false);

  // Trigger animation after mount
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const size = 280;
  const outerRadius = size / 2 - 30;
  const innerRadius = outerRadius - 12;

  const chordGenerator = useMemo(() => {
    return chord()
      .padAngle(0.05)
      .sortSubgroups(descending);
  }, []);

  const chordData = useMemo(() => {
    return chordGenerator(interactions);
  }, [chordGenerator, interactions]);

  const arcGenerator = useMemo(() => {
    return arc<ChordGroup>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);
  }, [innerRadius, outerRadius]);


  const getColor = (index: number) => {
    return SPEAKER_COLORS[index % SPEAKER_COLORS.length];
  };

  const getLabelPosition = (group: ChordGroup) => {
    const angle = (group.startAngle + group.endAngle) / 2;
    const radius = outerRadius + 18;
    const x = Math.sin(angle) * radius;
    const y = -Math.cos(angle) * radius;
    return { x, y, angle };
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <h4 className="font-medium text-sm text-foreground mb-2">Speaker Interaction Flow</h4>
      <p className="text-xs text-muted-foreground mb-4">
        Shows interaction patterns between speakers. Thicker ribbons indicate more interactions.
      </p>

      <div className="flex justify-center">
        <svg width={size} height={size} viewBox={`${-size/2} ${-size/2} ${size} ${size}`}>
          <defs>
            <style>{`
              @keyframes arcGrow {
                from {
                  transform: scale(0);
                  opacity: 0;
                }
                to {
                  transform: scale(1);
                  opacity: 1;
                }
              }
              @keyframes ribbonFade {
                from {
                  opacity: 0;
                  transform: scale(0.8);
                }
                to {
                  opacity: 0.65;
                  transform: scale(1);
                }
              }
              @keyframes labelFade {
                from {
                  opacity: 0;
                }
                to {
                  opacity: 1;
                }
              }
            `}</style>
          </defs>

          {/* Arcs (outer segments for each speaker) */}
          {chordData.groups.map((group, i) => {
            const path = arcGenerator(group);
            const isOtherHovered = hoveredIndex !== null && hoveredIndex !== i;
            
            return (
              <g key={`arc-${i}`}>
                <path
                  d={path || ""}
                  fill={getColor(i)}
                  opacity={isOtherHovered ? 0.3 : 1}
                  stroke="hsl(var(--background))"
                  strokeWidth={1}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="cursor-pointer transition-opacity duration-200"
                  style={{
                    transformOrigin: 'center',
                    animation: isAnimated ? `arcGrow 0.5s ease-out ${i * 0.08}s forwards` : 'none',
                    opacity: isAnimated ? undefined : 0,
                  }}
                />
              </g>
            );
          })}

          {/* Ribbons (connections between speakers) */}
          {chordData.map((chordItem, i) => {
            const ribbonGen = ribbon().radius(innerRadius);
            // @ts-ignore - d3-chord types are overly complex, this works at runtime
            const pathData: string | null = ribbonGen(chordItem);
            const isHighlighted = hoveredIndex === null || 
              hoveredIndex === chordItem.source.index || 
              hoveredIndex === chordItem.target.index;
            
            const sourceColor = getColor(chordItem.source.index);
            
            if (!pathData) return null;
            
            const baseDelay = chordData.groups.length * 0.08 + 0.2;
            
            return (
              <path
                key={`ribbon-${i}`}
                d={pathData}
                fill={sourceColor}
                stroke={sourceColor}
                strokeWidth={isHighlighted ? 0.5 : 0}
                className="transition-opacity duration-200"
                style={{
                  transformOrigin: 'center',
                  animation: isAnimated ? `ribbonFade 0.4s ease-out ${baseDelay + i * 0.05}s forwards` : 'none',
                  opacity: isAnimated ? (isHighlighted ? undefined : 0.1) : 0,
                }}
              />
            );
          })}

          {/* Labels */}
          {chordData.groups.map((group, i) => {
            const { x, y, angle } = getLabelPosition(group);
            const rotationDeg = angle * 180 / Math.PI;
            const shouldFlip = rotationDeg > 90 && rotationDeg < 270;
            const finalRotation = shouldFlip ? rotationDeg + 180 : rotationDeg;
            
            return (
              <text
                key={`label-${i}`}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[10px] font-medium fill-foreground"
                transform={`rotate(${finalRotation}, ${x}, ${y})`}
                style={{
                  animation: isAnimated ? `labelFade 0.3s ease-out ${0.3 + i * 0.08}s forwards` : 'none',
                  opacity: isAnimated ? undefined : 0,
                }}
              >
                {labels[i]}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-4 pt-3 border-t border-border">
        {labels.map((label, i) => (
          <div 
            key={label} 
            className="flex items-center gap-1.5 cursor-pointer"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getColor(i) }}
            />
            <span className="text-[10px] text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
