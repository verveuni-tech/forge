import type { VercelRequest, VercelResponse } from "@vercel/node";
import { HttpError, methodGuard, withErrorHandling } from "../_lib/http";
import { getRecommendationForExercise } from "../_lib/recommendation";

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  if (!methodGuard(req, res, ["GET"])) return;
  const exerciseId = req.query.exerciseId;
  if (typeof exerciseId !== "string") throw new HttpError(400, "Missing exercise id");

  const recommendation = await getRecommendationForExercise(exerciseId);
  res.status(200).json(recommendation);
});
