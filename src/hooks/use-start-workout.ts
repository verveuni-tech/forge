import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { apiPost } from "@/lib/api";
import { useActiveWorkoutStore, type WorkoutPlanExercise } from "@/store/active-workout-store";
import type { Recommendation } from "@/lib/recommendation-engine";

interface StartSessionExerciseRow {
  targetSets: number;
  targetRepRangeLow: number;
  targetRepRangeHigh: number;
  restSeconds: number;
  exercise: { id: string; name: string };
  recommendation: Recommendation;
}

interface StartSessionResponse {
  session: { id: string };
  exercises: StartSessionExerciseRow[];
}

/** Shared by Home's "Start Workout" CTA and the Workout tab's template picker. */
export function useStartWorkout() {
  const navigate = useNavigate();
  const startWorkout = useActiveWorkoutStore((s) => s.startWorkout);

  return useMutation({
    mutationFn: (templateId: string) =>
      apiPost<StartSessionResponse>("/api/sessions", { templateId }),
    onSuccess: (data) => {
      const exercisePlan: WorkoutPlanExercise[] = data.exercises.map((e) => ({
        exerciseId: e.exercise.id,
        exerciseName: e.exercise.name,
        targetSets: e.targetSets,
        targetRepRangeLow: e.targetRepRangeLow,
        targetRepRangeHigh: e.targetRepRangeHigh,
        restSeconds: e.restSeconds,
        recommendation: e.recommendation,
      }));
      startWorkout(data.session.id, exercisePlan);
      navigate("/workout");
    },
  });
}
