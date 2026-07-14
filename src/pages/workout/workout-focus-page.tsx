import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { apiPatch, apiPost } from "@/lib/api";
import { useActiveWorkoutStore } from "@/store/active-workout-store";
import { SessionHeader } from "@/components/forge/session-header";
import { ExerciseTimeline, type ExerciseTimelineItem } from "@/components/forge/exercise-timeline";
import { RecommendationPanel } from "@/components/forge/recommendation-panel";
import { WeightSelector } from "@/components/forge/weight-selector";
import { RepWheel } from "@/components/forge/rep-wheel";
import { RestTimerBubble } from "@/components/forge/rest-timer-bubble";
import { Button } from "@/components/ui/button";

function formatElapsed(startedAt: string | null): string {
  if (!startedAt) return "0:00";
  const totalSeconds = Math.max(0, Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function WorkoutFocusPage() {
  const navigate = useNavigate();
  const {
    sessionId,
    startedAt,
    exercisePlan,
    currentExerciseIndex,
    loggedSetsByExercise,
    selector,
    timer,
    logSet,
    setSelector,
    goToExercise,
    nextExercise,
    startRestTimer,
    stopRestTimer,
    tickTimer,
    finishWorkout,
  } = useActiveWorkoutStore();

  const [, forceTick] = useState(0);

  useEffect(() => {
    if (!sessionId) navigate("/", { replace: true });
  }, [sessionId, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      tickTimer();
      forceTick((n) => n + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [tickTimer]);

  const currentExercise = exercisePlan[currentExerciseIndex];

  useEffect(() => {
    if (currentExercise) {
      setSelector({
        weight: currentExercise.recommendation.suggestedWeight,
        reps: currentExercise.recommendation.suggestedReps[0],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentExerciseIndex]);

  const logSetMutation = useMutation({
    mutationFn: (input: { exerciseId: string; setNumber: number; weight: number; reps: number }) =>
      apiPost(`/api/sessions/${sessionId}/sets`, { ...input, isWarmup: false }),
  });

  const finishMutation = useMutation({
    mutationFn: (durationSeconds: number) =>
      apiPatch(`/api/sessions/${sessionId}`, { durationSeconds }),
    onSuccess: (summary, durationSeconds) => {
      const id = sessionId;
      finishWorkout();
      navigate(`/workout/summary/${id}`, { state: { summary, durationSeconds } });
    },
  });

  if (!sessionId || !currentExercise) return null;

  const loggedSets = loggedSetsByExercise[currentExercise.exerciseId] ?? [];
  const isLastExercise = currentExerciseIndex === exercisePlan.length - 1;

  const timelineItems: ExerciseTimelineItem[] = exercisePlan.map((ex, i) => ({
    id: ex.exerciseId,
    name: ex.exerciseName,
    status: i < currentExerciseIndex ? "done" : i === currentExerciseIndex ? "current" : "upcoming",
  }));

  const handleSaveSet = () => {
    const setNumber = loggedSets.length + 1;
    const localId = crypto.randomUUID();
    logSet({
      id: localId,
      exerciseId: currentExercise.exerciseId,
      setNumber,
      weight: selector.weight,
      reps: selector.reps,
      isWarmup: false,
    });
    startRestTimer(currentExercise.restSeconds, currentExercise.exerciseId);
    logSetMutation.mutate({
      exerciseId: currentExercise.exerciseId,
      setNumber,
      weight: selector.weight,
      reps: selector.reps,
    });
  };

  const handleFinish = () => {
    const durationSeconds = startedAt
      ? Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000)
      : 0;
    finishMutation.mutate(durationSeconds);
  };

  return (
    <div className="flex min-h-svh flex-col gap-4 pb-40">
      <SessionHeader
        title={currentExercise.exerciseName}
        elapsedLabel={`Elapsed ${formatElapsed(startedAt)}`}
      />

      <ExerciseTimeline items={timelineItems} onSelect={(id) => {
        const idx = exercisePlan.findIndex((e) => e.exerciseId === id);
        if (idx >= 0) goToExercise(idx);
      }} />

      <RecommendationPanel
        action={currentExercise.recommendation.action}
        suggestedWeight={currentExercise.recommendation.suggestedWeight}
        suggestedReps={currentExercise.recommendation.suggestedReps}
        reason={currentExercise.recommendation.reason}
      />

      <WeightSelector
        value={selector.weight}
        onChange={(weight) => setSelector({ weight })}
      />

      <RepWheel
        value={selector.reps}
        onChange={(reps) => setSelector({ reps })}
        min={1}
        max={Math.max(20, currentExercise.targetRepRangeHigh + 5)}
      />

      {loggedSets.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-2 px-screen">
          {loggedSets.map((s) => (
            <span
              key={s.id}
              className="rounded-full bg-muted px-3 py-1 text-caption font-medium text-foreground"
            >
              Set {s.setNumber}: {s.weight}kg × {s.reps}
            </span>
          ))}
        </div>
      ) : null}

      {timer.isResting ? (
        <RestTimerBubble secondsRemaining={timer.secondsRemaining} onSkip={stopRestTimer} />
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-40 flex flex-col gap-3 border-t border-border bg-surface/95 px-screen py-4 backdrop-blur-glass">
        <Button size="lg" onClick={handleSaveSet} disabled={logSetMutation.isPending}>
          Save Set
        </Button>

        {isLastExercise ? (
          <Button
            size="lg"
            variant="secondary"
            onClick={handleFinish}
            disabled={finishMutation.isPending}
          >
            {finishMutation.isPending ? "Finishing…" : "Finish Workout"}
          </Button>
        ) : (
          <Button size="lg" variant="secondary" onClick={nextExercise}>
            Next Exercise
          </Button>
        )}
      </div>
    </div>
  );
}
