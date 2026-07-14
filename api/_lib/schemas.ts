import { z } from "zod";
import { HttpError } from "./http.js";

export const muscleGroupSchema = z.enum([
  "chest",
  "back",
  "legs",
  "shoulders",
  "arms",
  "core",
]);

export const splitTypeSchema = z.enum([
  "ppl",
  "upper_lower",
  "arnold",
  "bro_split",
  "full_body",
  "custom",
]);

export const activateTemplateSchema = z.object({
  splitType: splitTypeSchema,
});

export const startSessionSchema = z.object({
  templateId: z.string().min(1),
});

export const finishSessionSchema = z.object({
  durationSeconds: z.number().int().nonnegative(),
});

export const logSetSchema = z.object({
  exerciseId: z.string().min(1),
  setNumber: z.number().int().positive(),
  weight: z.number().nonnegative(),
  reps: z.number().int().nonnegative(),
  isWarmup: z.boolean().optional().default(false),
});

export function parseBody<T extends z.ZodTypeAny>(schema: T, body: unknown): z.infer<T> {
  const result = schema.safeParse(body);
  if (!result.success) {
    throw new HttpError(400, result.error.issues.map((i) => i.message).join("; "));
  }
  return result.data;
}
