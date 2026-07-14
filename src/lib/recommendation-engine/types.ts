export interface PerformedSet {
  weight: number;
  reps: number;
  isWarmup: boolean;
}

/** `history` arrays are ordered chronologically ascending — oldest first, most recent last. */
export interface PerformedSession {
  sessionId: string;
  date: string;
  sets: PerformedSet[];
}

export interface ExerciseTargets {
  repRangeLow: number;
  repRangeHigh: number;
  /** Smallest weight jump this exercise's equipment supports, e.g. 2.5 for barbell plates. */
  weightIncrement: number;
}

export type RecommendationAction =
  | "increase_weight"
  | "maintain_weight"
  | "decrease_weight"
  | "increase_reps"
  | "deload";

export interface RecommendationAlternative {
  label: string;
  weight: number;
}

export interface Recommendation {
  action: RecommendationAction;
  suggestedWeight: number;
  suggestedReps: [number, number];
  reason: string;
  alternatives?: RecommendationAlternative[];
}
