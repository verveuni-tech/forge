import type { VercelRequest, VercelResponse } from "@vercel/node";
import { desc, eq } from "drizzle-orm";
import { db, schema } from "../_lib/db.js";
import { methodGuard, withErrorHandling } from "../_lib/http.js";

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  if (!methodGuard(req, res, ["GET"])) return;

  const rows = await db
    .select({
      id: schema.personalRecords.id,
      recordType: schema.personalRecords.recordType,
      value: schema.personalRecords.value,
      reps: schema.personalRecords.reps,
      achievedAt: schema.personalRecords.achievedAt,
      previousValue: schema.personalRecords.previousValue,
      exerciseId: schema.exercises.id,
      exerciseName: schema.exercises.name,
    })
    .from(schema.personalRecords)
    .innerJoin(schema.exercises, eq(schema.personalRecords.exerciseId, schema.exercises.id))
    .orderBy(desc(schema.personalRecords.achievedAt));

  res.status(200).json(rows);
});
