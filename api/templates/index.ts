import type { VercelRequest, VercelResponse } from "@vercel/node";
import { asc, eq } from "drizzle-orm";
import { db, schema } from "../_lib/db.js";
import { methodGuard, withErrorHandling } from "../_lib/http.js";

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  if (!methodGuard(req, res, ["GET"])) return;

  const templates = await db
    .select()
    .from(schema.workoutTemplates)
    .orderBy(asc(schema.workoutTemplates.splitType), asc(schema.workoutTemplates.sortOrder));

  const templateExercises = await db
    .select({
      templateId: schema.workoutTemplateExercises.templateId,
      order: schema.workoutTemplateExercises.order,
      targetSets: schema.workoutTemplateExercises.targetSets,
      targetRepRangeLow: schema.workoutTemplateExercises.targetRepRangeLow,
      targetRepRangeHigh: schema.workoutTemplateExercises.targetRepRangeHigh,
      restSeconds: schema.workoutTemplateExercises.restSeconds,
      exercise: schema.exercises,
    })
    .from(schema.workoutTemplateExercises)
    .innerJoin(schema.exercises, eq(schema.workoutTemplateExercises.exerciseId, schema.exercises.id))
    .orderBy(asc(schema.workoutTemplateExercises.order));

  const exercisesByTemplate = new Map<string, typeof templateExercises>();
  for (const row of templateExercises) {
    if (!exercisesByTemplate.has(row.templateId)) exercisesByTemplate.set(row.templateId, []);
    exercisesByTemplate.get(row.templateId)!.push(row);
  }

  const groups = new Map<string, typeof templates>();
  for (const t of templates) {
    if (!groups.has(t.splitType)) groups.set(t.splitType, []);
    groups.get(t.splitType)!.push(t);
  }

  const result = Array.from(groups.entries()).map(([splitType, days]) => ({
    splitType,
    templates: days.map((t) => ({
      ...t,
      exercises: exercisesByTemplate.get(t.id) ?? [],
    })),
  }));

  res.status(200).json(result);
});
