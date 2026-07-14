import type { VercelRequest, VercelResponse } from "@vercel/node";
import { and, eq } from "drizzle-orm";
import { db, schema } from "../_lib/db.js";
import { HttpError, methodGuard, withErrorHandling } from "../_lib/http.js";

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  if (!methodGuard(req, res, ["DELETE"])) return;

  const sessionId = req.query.id;
  const setId = req.query.setId;
  if (typeof sessionId !== "string" || typeof setId !== "string") {
    throw new HttpError(400, "Missing session or set id");
  }

  await db
    .delete(schema.loggedSets)
    .where(and(eq(schema.loggedSets.id, setId), eq(schema.loggedSets.sessionId, sessionId)));

  res.status(200).json({ ok: true });
});
