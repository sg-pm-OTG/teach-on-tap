import { LucideIcon, Check, Lock, MapPin, Calendar, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MilestoneStatus } from "@/hooks/useJourneyProgress";
import { Button } from "@/components/ui/button";

interface MilestoneCardProps {
  label: string;
  icon: LucideIcon;
  status: MilestoneStatus;
  description?: string;
  date?: string;
  location?: string;
  progress?: string;
  statusLabel?: string;
  isExpanded?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

const MilestoneCard = ({
  label,
  icon: Icon,
  status,
  description,
  date,
  location,
  progress,
  statusLabel,
  isExpanded = false,
  actionLabel,
  onAction,
}: MilestoneCardProps) => {
  const isComplete = status === "complete";
  const isCurrent = status === "current";
  const isLocked = status === "locked";

  return (
    <div
      className={cn(
        "relative rounded-xl border p-4 transition-all duration-200",
        isComplete && "border-primary/30 bg-primary/5",
        isCurrent && "border-primary bg-card shadow-md",
        isLocked && "border-muted bg-muted/30 opacity-60"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Status Icon */}
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
            isComplete && "bg-primary text-primary-foreground",
            isCurrent && "bg-primary/10 text-primary",
            isLocked && "bg-muted text-muted-foreground"
          )}
        >
          {isComplete ? (
            <Check className="h-5 w-5" />
          ) : isLocked ? (
            <Lock className="h-4 w-4" />
          ) : (
            <Icon className="h-5 w-5" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4
              className={cn(
                "font-semibold text-sm",
                isLocked && "text-muted-foreground"
              )}
            >
              {label}
            </h4>
            {isCurrent && (
              <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground uppercase tracking-wide">
                Next Step
              </span>
            )}
            {progress && (
              <span className="shrink-0 text-xs text-muted-foreground">
                {progress}
              </span>
            )}
          </div>

          {description && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}

          {statusLabel && (
            <p className={cn(
              "mt-1 text-xs font-medium",
              statusLabel === "Pending Generation" && "text-amber-600 dark:text-amber-400"
            )}>
              {statusLabel}
            </p>
          )}

          {/* Expanded details for current milestone */}
          {(isCurrent || isExpanded) && (date || location) && (
            <div className="mt-3 space-y-2 text-xs">
              {date && (
                <div className="flex items-start gap-2 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  <span>{date}</span>
                </div>
              )}
              {location && (
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  <span className="leading-relaxed">{location}</span>
                </div>
              )}
            </div>
          )}

          {/* Action button for current milestone */}
          {isCurrent && actionLabel && onAction && (
            <Button
              variant="default"
              size="sm"
              className="mt-3 w-full"
              onClick={onAction}
            >
              {actionLabel}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MilestoneCard;
