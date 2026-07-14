import { and, asc, eq } from "drizzle-orm";
import { db, schema } from "./db";
import {
  detectPlateau,
  recommendNextSession,
  type ExerciseTargets,
  type PerformedSession,
  type Recommendation,
} from "../../src/lib/recommendation-engine";

function weightIncrementFor(equipment: string | null): number {
  return equipment === "bodyweight" ? 0 : 2.5;
}

/** Chronologically ascending (oldest first), last `sessionLimit` completed sessions only. */
export async function getExerciseHistory(
  exerciseId: string,
  sessionLimit = 6,
): Promise<PerformedSession[]> {
  const rows = await db
    .select({
      sessionId: schema.loggedSets.sessionId,
      weight: schema.loggedSets.weight,
      reps: schema.loggedSets.reps,
      isWarmup: schema.loggedSets.isWarmup,
      startedAt: schema.workoutSessions.startedAt,
    })
    .from(schema.loggedSets)
    .innerJoin(schema.workoutSessions, eq(schema.loggedSets.sessionId, schema.workoutSessions.id))
    .where(
      and(
        eq(schema.loggedSets.exerciseId, exerciseId),
        eq(schema.workoutSessions.status, "completed"),
      ),
    )
    .orderBy(asc(schema.workoutSessions.startedAt));

  const bySession = new Map<string, PerformedSession>();
  for (const row of rows) {
    if (!bySession.has(row.sessionId)) {
      bySession.set(row.sessionId, {
        sessionId: row.sessionId,
        date: row.startedAt.toISOString(),
        sets: [],
      });
    }
    bySession.get(row.sessionId)!.sets.push({
      weight: Number(row.weight),
      reps: row.reps,
      isWarmup: row.isWarmup,
    });
  }

  return Array.from(bySession.values()).slice(-sessionLimit);
}

export async function getExerciseTargets(exerciseId: string): Promise<ExerciseTargets> {
  const [exercise] = await db
    .select()
    .from(schema.exercises)
    .where(eq(schema.exercises.id, exerciseId))
    .limit(1);
  if (!exercise) throw new Error(`Exercise not found: ${exerciseId}`);
  return {
    repRangeLow: exercise.defaultRepRangeLow,
    repRangeHigh: exercise.defaultRepRangeHigh,
    weightIncrement: weightIncrementFor(exercise.equipment),
  };
}

export async function getRecommendationForExercise(exerciseId: string): Promise<Recommendation> {
  const targets = await getExerciseTargets(exerciseId);
  const history = await getExerciseHistory(exerciseId);
  return recommendNextSession(history, targets);
}

/** Recomputes and persists exercise_progress_state after a session completes. */
export async function refreshExerciseProgressState(exerciseId: string): Promise<Recommendation> {
  const targets = await getExerciseTargets(exerciseId);
  const history = await getExerciseHistory(exerciseId);
  const recommendation = recommendNextSession(history, targets);
  const lastSession = history[history.length - 1];
  const lastWorkingSets = lastSession?.sets.filter((s) => !s.isWarmup) ?? [];
  const isPlateau = detectPlateau(history);
  const now = new Date();

  const values = {
    exerciseId,
    lastWeight: lastWorkingSets[0] ? String(lastWorkingSets[0].weight) : null,
    lastReps: lastWorkingSets.map((s) => s.reps),
    lastSessionId: lastSession?.sessionId ?? null,
    lastSessionDate: lastSession ? new Date(lastSession.date) : null,
    targetRepRangeLow: targets.repRangeLow,
    targetRepRangeHigh: targets.repRangeHigh,
    plateauDetectedAt: isPlateau ? now : null,
    lastRecommendation: {
      action: recommendation.action,
      suggestedWeight: recommendation.suggestedWeight,
      suggestedReps: recommendation.suggestedReps,
      reason: recommendation.reason,
      generatedAt: now.toISOString(),
    },
    updatedAt: now,
  };

  await db
    .insert(schema.exerciseProgressState)
    .values(values)
    .onConflictDoUpdate({
      target: schema.exerciseProgressState.exerciseId,
      set: values,
    });

  return recommendation;
}
