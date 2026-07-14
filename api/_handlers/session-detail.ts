import type { VercelRequest, VercelResponse } from "@vercel/node";
import { asc, eq } from "drizzle-orm";
import { db, schema } from "../_lib/db.js";
import { HttpError, methodGuard, withErrorHandling } from "../_lib/http.js";
import { finishSessionSchema, parseBody } from "../_lib/schemas.js";
import { recomputePersonalRecords } from "../_lib/records.js";
import { refreshExerciseProgressState } from "../_lib/recommendation.js";

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method === "GET") return getSession(req, res);
  if (req.method === "PATCH") return finishSession(req, res);
  if (!methodGuard(req, res, ["GET", "PATCH"])) return;
});

function requireId(req: VercelRequest): string {
  const id = req.query.id;
  if (typeof id !== "string") throw new HttpError(400, "Missing session id");
  return id;
}

async function getSession(req: VercelRequest, res: VercelResponse) {
  const id = requireId(req);
  const [session] = await db
    .select()
    .from(schema.workoutSessions)
    .where(eq(schema.workoutSessions.id, id))
    .limit(1);
  if (!session) throw new HttpError(404, "Session not found");

  const loggedSets = await db
    .select({
      id: schema.loggedSets.id,
      exerciseId: schema.loggedSets.exerciseId,
      exerciseName: schema.exercises.name,
      setNumber: schema.loggedSets.setNumber,
      weight: schema.loggedSets.weight,
      reps: schema.loggedSets.reps,
      isWarmup: schema.loggedSets.isWarmup,
      completedAt: schema.loggedSets.completedAt,
    })
    .from(schema.loggedSets)
    .innerJoin(schema.exercises, eq(schema.loggedSets.exerciseId, schema.exercises.id))
    .where(eq(schema.loggedSets.sessionId, id))
    .orderBy(asc(schema.loggedSets.completedAt));

  res.status(200).json({ session, loggedSets });
}

async function finishSession(req: VercelRequest, res: VercelResponse) {
  const id = requireId(req);
  const { durationSeconds } = parseBody(finishSessionSchema, req.body);

  const [session] = await db
    .select()
    .from(schema.workoutSessions)
    .where(eq(schema.workoutSessions.id, id))
    .limit(1);
  if (!session) throw new HttpError(404, "Session not found");
  if (session.status !== "in_progress") throw new HttpError(409, "Session is not in progress");

  const loggedSets = await db
    .select()
    .from(schema.loggedSets)
    .where(eq(schema.loggedSets.sessionId, id));

  const workingSets = loggedSets.filter((s) => !s.isWarmup);
  const totalVolume = workingSets.reduce((sum, s) => sum + Number(s.weight) * s.reps, 0);

  const [updatedSession] = await db
    .update(schema.workoutSessions)
    .set({
      status: "completed",
      completedAt: new Date(),
      durationSeconds,
      totalVolume: String(totalVolume),
    })
    .where(eq(schema.workoutSessions.id, id))
    .returning();

  const newRecords = await recomputePersonalRecords(
    id,
    loggedSets.map((s) => ({
      exerciseId: s.exerciseId,
      weight: Number(s.weight),
      reps: s.reps,
      isWarmup: s.isWarmup,
    })),
  );

  const exerciseIds = Array.from(new Set(loggedSets.map((s) => s.exerciseId)));
  for (const exerciseId of exerciseIds) {
    await refreshExerciseProgressState(exerciseId);
  }

  const exerciseNames = await db
    .select({ id: schema.exercises.id, name: schema.exercises.name })
    .from(schema.exercises);
  const nameById = new Map(exerciseNames.map((e) => [e.id, e.name]));

  const coachSummary =
    newRecords.length > 0
      ? `New PR${newRecords.length > 1 ? "s" : ""} today: ${newRecords
          .map((r) => nameById.get(r.exerciseId) ?? "an exercise")
          .join(", ")}. Strong session.`
      : `Solid session — ${workingSets.length} sets logged across ${exerciseIds.length} exercises.`;

  res.status(200).json({
    session: updatedSession,
    durationSeconds,
    totalVolume,
    setsCompleted: workingSets.length,
    exercisesCompleted: exerciseIds.length,
    newRecords: newRecords.map((r) => ({ ...r, exerciseName: nameById.get(r.exerciseId) })),
    coachSummary,
  });
}
