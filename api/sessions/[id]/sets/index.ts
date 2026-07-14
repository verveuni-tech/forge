import { randomUUID } from "node:crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq } from "drizzle-orm";
import { db, schema } from "../../../_lib/db.js";
import { HttpError, methodGuard, withErrorHandling } from "../../../_lib/http.js";
import { logSetSchema, parseBody } from "../../../_lib/schemas.js";
import { estimateOneRepMax } from "../../../../src/lib/recommendation-engine/index.js";

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  if (!methodGuard(req, res, ["POST"])) return;

  const sessionId = req.query.id;
  if (typeof sessionId !== "string") throw new HttpError(400, "Missing session id");

  const [session] = await db
    .select()
    .from(schema.workoutSessions)
    .where(eq(schema.workoutSessions.id, sessionId))
    .limit(1);
  if (!session) throw new HttpError(404, "Session not found");
  if (session.status !== "in_progress") throw new HttpError(409, "Session is not in progress");

  const body = parseBody(logSetSchema, req.body);

  const [loggedSet] = await db
    .insert(schema.loggedSets)
    .values({
      id: randomUUID(),
      sessionId,
      exerciseId: body.exerciseId,
      setNumber: body.setNumber,
      weight: String(body.weight),
      reps: body.reps,
      isWarmup: body.isWarmup,
      estimatedOneRm: body.isWarmup ? null : String(estimateOneRepMax(body.weight, body.reps)),
    })
    .returning();

  res.status(201).json(loggedSet);
});
