import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq } from "drizzle-orm";
import { db, schema } from "../_lib/db";
import { methodGuard, withErrorHandling } from "../_lib/http";
import { activateTemplateSchema, parseBody } from "../_lib/schemas";

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  if (!methodGuard(req, res, ["POST"])) return;
  const { splitType } = parseBody(activateTemplateSchema, req.body);

  await db.update(schema.workoutTemplates).set({ isActive: false });
  await db
    .update(schema.workoutTemplates)
    .set({ isActive: true })
    .where(eq(schema.workoutTemplates.splitType, splitType));

  res.status(200).json({ ok: true });
});
