import type { VercelRequest, VercelResponse } from "@vercel/node";
import { asc, desc, eq } from "drizzle-orm";
import { differenceInCalendarDays, isSameDay, startOfWeek } from "date-fns";
import { db, schema } from "./_lib/db.js";
import { methodGuard, withErrorHandling } from "./_lib/http.js";
import { getRecommendationForExercise } from "./_lib/recommendation.js";

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  if (!methodGuard(req, res, ["GET"])) return;

  const activeTemplates = await db
    .select()
    .from(schema.workoutTemplates)
    .where(eq(schema.workoutTemplates.isActive, true))
    .orderBy(asc(schema.workoutTemplates.sortOrder));

  const completedSessions = await db
    .select()
    .from(schema.workoutSessions)
    .where(eq(schema.workoutSessions.status, "completed"))
    .orderBy(desc(schema.workoutSessions.completedAt));

  // Today's template: cycle through the active split by how many sessions already ran against it.
  let todayTemplate = activeTemplates[0] ?? null;
  if (activeTemplates.length > 0) {
    const activeIds = new Set(activeTemplates.map((t) => t.id));
    const completedAgainstSplit = completedSessions.filter(
      (s) => s.templateId && activeIds.has(s.templateId),
    ).length;
    todayTemplate = activeTemplates[completedAgainstSplit % activeTemplates.length];
  }

  // Streak: consecutive calendar days ending today or yesterday.
  const completedDates = completedSessions
    .map((s) => s.completedAt)
    .filter((d): d is Date => d !== null);
  let streak = 0;
  if (completedDates.length > 0) {
    const uniqueDays: Date[] = [];
    for (const d of completedDates) {
      if (!uniqueDays.some((u) => isSameDay(u, d))) uniqueDays.push(d);
    }
    let cursor = new Date();
    for (const day of uniqueDays) {
      const diff = differenceInCalendarDays(cursor, day);
      if (diff <= 1) {
        streak += 1;
        cursor = day;
      } else {
        break;
      }
    }
  }

  // Weekly progress: sessions completed this week vs. number of days in the active split.
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const sessionsThisWeek = completedSessions.filter(
    (s) => s.completedAt && s.completedAt >= weekStart,
  ).length;
  const weeklyTarget = activeTemplates.length || 1;
  const weeklyProgressPercent = Math.min(100, Math.round((sessionsThisWeek / weeklyTarget) * 100));

  const [recentPr] = await db
    .select({
      id: schema.personalRecords.id,
      recordType: schema.personalRecords.recordType,
      value: schema.personalRecords.value,
      achievedAt: schema.personalRecords.achievedAt,
      exerciseName: schema.exercises.name,
    })
    .from(schema.personalRecords)
    .innerJoin(schema.exercises, eq(schema.personalRecords.exerciseId, schema.exercises.id))
    .orderBy(desc(schema.personalRecords.achievedAt))
    .limit(1);

  let coachTeaser = null;
  let todayExerciseCount = 0;
  if (todayTemplate) {
    const templateExercises = await db
      .select({ exerciseId: schema.workoutTemplateExercises.exerciseId })
      .from(schema.workoutTemplateExercises)
      .where(eq(schema.workoutTemplateExercises.templateId, todayTemplate.id))
      .orderBy(asc(schema.workoutTemplateExercises.order));
    todayExerciseCount = templateExercises.length;
    if (templateExercises[0]) {
      coachTeaser = await getRecommendationForExercise(templateExercises[0].exerciseId);
    }
  }

  res.status(200).json({
    todayTemplate: todayTemplate ? { ...todayTemplate, exerciseCount: todayExerciseCount } : null,
    streak,
    weeklyProgressPercent,
    recentPr: recentPr ?? null,
    coachTeaser,
  });
});
