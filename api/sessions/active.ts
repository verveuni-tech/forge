import type { VercelRequest, VercelResponse } from "@vercel/node";
import { desc, eq } from "drizzle-orm";
import { db, schema } from "../_lib/db.js";
import { methodGuard, withErrorHandling } from "../_lib/http.js";

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  if (!methodGuard(req, res, ["GET"])) return;

  const [session] = await db
    .select()
    .from(schema.workoutSessions)
    .where(eq(schema.workoutSessions.status, "in_progress"))
    .orderBy(desc(schema.workoutSessions.startedAt))
    .limit(1);

  res.status(200).json(session ?? null);
});
