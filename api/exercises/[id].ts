import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq } from "drizzle-orm";
import { db, schema } from "../_lib/db";
import { HttpError, methodGuard, withErrorHandling } from "../_lib/http";
import { getExerciseHistory } from "../_lib/recommendation";

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  if (!methodGuard(req, res, ["GET"])) return;
  const id = req.query.id;
  if (typeof id !== "string") throw new HttpError(400, "Missing exercise id");

  const [exercise] = await db
    .select()
    .from(schema.exercises)
    .where(eq(schema.exercises.id, id))
    .limit(1);
  if (!exercise) throw new HttpError(404, "Exercise not found");

  const [progress] = await db
    .select()
    .from(schema.exerciseProgressState)
    .where(eq(schema.exerciseProgressState.exerciseId, id))
    .limit(1);

  const recentSessions = await getExerciseHistory(id);

  res.status(200).json({ exercise, progress: progress ?? null, recentSessions });
});
