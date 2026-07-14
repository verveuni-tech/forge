import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sql } from "drizzle-orm";
import { db } from "./_lib/db.js";
import { methodGuard, withErrorHandling } from "./_lib/http.js";

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  if (!methodGuard(req, res, ["GET"])) return;
  await db.execute(sql`select 1`);
  res.status(200).json({ ok: true });
});
