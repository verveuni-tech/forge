import type { VercelRequest, VercelResponse } from "@vercel/node";
import { and, asc, ilike, eq } from "drizzle-orm";
import { db, schema } from "../_lib/db.js";
import { methodGuard, withErrorHandling } from "../_lib/http.js";
import { muscleGroupSchema } from "../_lib/schemas.js";

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  if (!methodGuard(req, res, ["GET"])) return;

  const muscleParam = typeof req.query.muscle === "string" ? req.query.muscle : undefined;
  const search = typeof req.query.search === "string" ? req.query.search : undefined;
  const muscle = muscleParam ? muscleGroupSchema.parse(muscleParam) : undefined;

  const conditions = [
    muscle ? eq(schema.exercises.primaryMuscle, muscle) : undefined,
    search ? ilike(schema.exercises.name, `%${search}%`) : undefined,
  ].filter((c): c is NonNullable<typeof c> => c !== undefined);

  const rows = await db
    .select()
    .from(schema.exercises)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(asc(schema.exercises.name));

  res.status(200).json(rows);
});
