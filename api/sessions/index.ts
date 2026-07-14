import { randomUUID } from "node:crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { and, asc, desc, eq, lt } from "drizzle-orm";
import { db, schema } from "../_lib/db";
import { HttpError, methodGuard, withErrorHandling } from "../_lib/http";
import { parseBody, startSessionSchema } from "../_lib/schemas";
import { getRecommendationForExercise } from "../_lib/recommendation";

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method === "POST") return startSession(req, res);
  if (req.method === "GET") return listSessions(req, res);
  if (!methodGuard(req, res, ["POST", "GET"])) return;
});

async function startSession(req: VercelRequest, res: VercelResponse) {
  const { templateId } = parseBody(startSessionSchema, req.body);

  const [template] = await db
    .select()
    .from(schema.workoutTemplates)
    .where(eq(schema.workoutTemplates.id, templateId))
    .limit(1);
  if (!template) throw new HttpError(404, "Workout template not found");

  const templateExercises = await db
    .select({
      order: schema.workoutTemplateExercises.order,
      targetSets: schema.workoutTemplateExercises.targetSets,
      targetRepRangeLow: schema.workoutTemplateExercises.targetRepRangeLow,
      targetRepRangeHigh: schema.workoutTemplateExercises.targetRepRangeHigh,
      restSeconds: schema.workoutTemplateExercises.restSeconds,
      exercise: schema.exercises,
    })
    .from(schema.workoutTemplateExercises)
    .where(eq(schema.workoutTemplateExercises.templateId, templateId))
    .innerJoin(schema.exercises, eq(schema.workoutTemplateExercises.exerciseId, schema.exercises.id))
    .orderBy(asc(schema.workoutTemplateExercises.order));

  const sessionId = randomUUID();
  const [session] = await db
    .insert(schema.workoutSessions)
    .values({
      id: sessionId,
      templateId,
      name: template.dayLabel,
      status: "in_progress",
    })
    .returning();

  const exercisesWithRecommendation = await Promise.all(
    templateExercises.map(async (te) => ({
      ...te,
      recommendation: await getRecommendationForExercise(te.exercise.id),
    })),
  );

  res.status(201).json({ session, exercises: exercisesWithRecommendation });
}

async function listSessions(req: VercelRequest, res: VercelResponse) {
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const before = typeof req.query.before === "string" ? new Date(req.query.before) : undefined;

  const conditions = [
    eq(schema.workoutSessions.status, "completed"),
    before ? lt(schema.workoutSessions.completedAt, before) : undefined,
  ].filter((c): c is NonNullable<typeof c> => c !== undefined);

  const rows = await db
    .select()
    .from(schema.workoutSessions)
    .where(and(...conditions))
    .orderBy(desc(schema.workoutSessions.completedAt))
    .limit(limit);

  res.status(200).json(rows);
}
