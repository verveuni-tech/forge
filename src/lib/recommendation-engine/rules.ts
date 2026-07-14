import { detectPlateau } from "./plateau-detection";
import type { ExerciseTargets, PerformedSession, Recommendation } from "./types";

function roundToIncrement(weight: number, increment: number): number {
  return Math.round(weight / increment) * increment;
}

/**
 * Pure progressive-overload rule set (forge.md "Example Logic"):
 *  - Bench case: every working set hit the top of the rep range → increase weight.
 *  - Squat case: any working set fell short of the rep range floor → hold weight.
 *  - Shoulder-press case: 3 consecutive identical sessions → plateau, suggest a deload.
 * Takes/returns plain data only — no DB or UI dependency.
 */
export function recommendNextSession(
  history: PerformedSession[],
  targets: ExerciseTargets,
): Recommendation {
  if (history.length === 0) {
    return {
      action: "maintain_weight",
      suggestedWeight: 0,
      suggestedReps: [targets.repRangeLow, targets.repRangeHigh],
      reason: "No previous data yet — log your first session to get personalized recommendations.",
    };
  }

  if (detectPlateau(history)) {
    const lastSession = history[history.length - 1];
    const lastWorkingSets = lastSession.sets.filter((s) => !s.isWarmup);
    const lastWeight = lastWorkingSets[0]?.weight ?? 0;
    const deloadWeight = roundToIncrement(lastWeight * 0.9, targets.weightIncrement);
    return {
      action: "deload",
      suggestedWeight: lastWeight,
      suggestedReps: [targets.repRangeLow, targets.repRangeHigh],
      reason: "Plateau detected — same weight and reps for 3 sessions in a row.",
      alternatives: [
        { label: "Reduce volume", weight: lastWeight },
        { label: "Take a deload", weight: deloadWeight },
      ],
    };
  }

  const lastSession = history[history.length - 1];
  const workingSets = lastSession.sets.filter((s) => !s.isWarmup);
  const lastWeight = workingSets[0]?.weight ?? 0;

  const allHitHigh = workingSets.length > 0 && workingSets.every((s) => s.reps >= targets.repRangeHigh);
  const anyBelowLow = workingSets.some((s) => s.reps < targets.repRangeLow);

  if (allHitHigh) {
    return {
      action: "increase_weight",
      suggestedWeight: roundToIncrement(lastWeight + targets.weightIncrement, targets.weightIncrement),
      suggestedReps: [targets.repRangeLow, targets.repRangeHigh],
      reason: "Reached upper rep target for every set last session.",
    };
  }

  if (anyBelowLow) {
    return {
      action: "maintain_weight",
      suggestedWeight: lastWeight,
      suggestedReps: [targets.repRangeLow, targets.repRangeHigh],
      reason: "Target not yet achieved.",
    };
  }

  return {
    action: "increase_reps",
    suggestedWeight: lastWeight,
    suggestedReps: [targets.repRangeLow, targets.repRangeHigh],
    reason: "On track — keep pushing reps at this weight before increasing load.",
  };
}
