import { cn } from "@/lib/utils";
import type { RecommendationAction } from "@/lib/recommendation-engine";

const ACTION_LABEL: Record<RecommendationAction, string> = {
  increase_weight: "Increase weight",
  maintain_weight: "Stay at this weight",
  decrease_weight: "Decrease weight",
  increase_reps: "Push reps",
  deload: "Deload recommended",
};

const ACTION_COLOR: Record<RecommendationAction, string> = {
  increase_weight: "text-success",
  maintain_weight: "text-primary",
  decrease_weight: "text-warning",
  increase_reps: "text-primary",
  deload: "text-warning",
};

interface RecommendationPanelProps {
  action: RecommendationAction;
  suggestedWeight: number;
  suggestedReps: [number, number];
  reason: string;
  unit?: string;
}

/** The visual focal point of every exercise (forge.md Principle 3): always visible, never hidden. */
export function RecommendationPanel({
  action,
  suggestedWeight,
  suggestedReps,
  reason,
  unit = "kg",
}: RecommendationPanelProps) {
  return (
    <div className="shape-capsule mx-auto flex w-fit max-w-xs flex-col items-center gap-1 px-8 py-6 text-center">
      <span className={cn("text-label font-medium uppercase tracking-wide", ACTION_COLOR[action])}>
        {ACTION_LABEL[action]}
      </span>
      <span className="text-display font-semibold tabular-nums text-foreground">
        {suggestedWeight}
        {unit}
      </span>
      <span className="text-caption text-muted-foreground">
        Target {suggestedReps[0]}–{suggestedReps[1]} reps
      </span>
      <p className="mt-2 text-caption text-muted-foreground">{reason}</p>
    </div>
  );
}
