import { randomUUID } from "node:crypto";
import { db } from "./index.js";
import { exercises, workoutTemplates, workoutTemplateExercises } from "./schema.js";

type MuscleGroup = "chest" | "back" | "legs" | "shoulders" | "arms" | "core";

interface ExerciseSeed {
  slug: string;
  name: string;
  primaryMuscle: MuscleGroup;
  equipment: string;
  repRange: [number, number];
  isCompound?: boolean;
}

const EXERCISES: ExerciseSeed[] = [
  // Chest
  { slug: "barbell-bench-press", name: "Barbell Bench Press", primaryMuscle: "chest", equipment: "barbell", repRange: [6, 8], isCompound: true },
  { slug: "incline-dumbbell-press", name: "Incline Dumbbell Press", primaryMuscle: "chest", equipment: "dumbbell", repRange: [8, 10] },
  { slug: "cable-fly", name: "Cable Fly", primaryMuscle: "chest", equipment: "cable", repRange: [10, 15] },
  { slug: "push-up", name: "Push-Up", primaryMuscle: "chest", equipment: "bodyweight", repRange: [10, 15] },
  // Back
  { slug: "deadlift", name: "Deadlift", primaryMuscle: "back", equipment: "barbell", repRange: [4, 6], isCompound: true },
  { slug: "pull-up", name: "Pull-Up", primaryMuscle: "back", equipment: "bodyweight", repRange: [6, 10], isCompound: true },
  { slug: "barbell-row", name: "Barbell Row", primaryMuscle: "back", equipment: "barbell", repRange: [6, 8], isCompound: true },
  { slug: "lat-pulldown", name: "Lat Pulldown", primaryMuscle: "back", equipment: "cable", repRange: [8, 12] },
  // Legs
  { slug: "back-squat", name: "Back Squat", primaryMuscle: "legs", equipment: "barbell", repRange: [5, 8], isCompound: true },
  { slug: "romanian-deadlift", name: "Romanian Deadlift", primaryMuscle: "legs", equipment: "barbell", repRange: [8, 10], isCompound: true },
  { slug: "leg-press", name: "Leg Press", primaryMuscle: "legs", equipment: "machine", repRange: [10, 12] },
  { slug: "walking-lunge", name: "Walking Lunge", primaryMuscle: "legs", equipment: "dumbbell", repRange: [10, 12] },
  { slug: "leg-curl", name: "Leg Curl", primaryMuscle: "legs", equipment: "machine", repRange: [10, 15] },
  // Shoulders
  { slug: "overhead-press", name: "Overhead Press", primaryMuscle: "shoulders", equipment: "barbell", repRange: [6, 8], isCompound: true },
  { slug: "lateral-raise", name: "Lateral Raise", primaryMuscle: "shoulders", equipment: "dumbbell", repRange: [12, 15] },
  { slug: "rear-delt-fly", name: "Rear Delt Fly", primaryMuscle: "shoulders", equipment: "dumbbell", repRange: [12, 15] },
  { slug: "face-pull", name: "Face Pull", primaryMuscle: "shoulders", equipment: "cable", repRange: [12, 15] },
  // Arms
  { slug: "barbell-curl", name: "Barbell Curl", primaryMuscle: "arms", equipment: "barbell", repRange: [8, 12] },
  { slug: "hammer-curl", name: "Hammer Curl", primaryMuscle: "arms", equipment: "dumbbell", repRange: [10, 12] },
  { slug: "close-grip-bench-press", name: "Close-Grip Bench Press", primaryMuscle: "arms", equipment: "barbell", repRange: [6, 10], isCompound: true },
  { slug: "tricep-pushdown", name: "Tricep Pushdown", primaryMuscle: "arms", equipment: "cable", repRange: [10, 15] },
  { slug: "skull-crusher", name: "Skull Crusher", primaryMuscle: "arms", equipment: "barbell", repRange: [8, 12] },
  // Core
  { slug: "hanging-leg-raise", name: "Hanging Leg Raise", primaryMuscle: "core", equipment: "bodyweight", repRange: [10, 15] },
  { slug: "cable-crunch", name: "Cable Crunch", primaryMuscle: "core", equipment: "cable", repRange: [12, 15] },
  { slug: "plank", name: "Plank", primaryMuscle: "core", equipment: "bodyweight", repRange: [30, 60] },
  { slug: "ab-wheel-rollout", name: "Ab Wheel Rollout", primaryMuscle: "core", equipment: "bodyweight", repRange: [8, 12] },
];

interface TemplateSeed {
  splitType: "ppl" | "upper_lower" | "arnold" | "bro_split" | "full_body";
  dayLabel: string;
  sortOrder: number;
  estimatedDurationMinutes: number;
  exerciseSlugs: string[];
}

const TEMPLATES: TemplateSeed[] = [
  // Push Pull Legs
  { splitType: "ppl", dayLabel: "Push", sortOrder: 0, estimatedDurationMinutes: 65, exerciseSlugs: ["barbell-bench-press", "overhead-press", "incline-dumbbell-press", "lateral-raise", "tricep-pushdown", "skull-crusher"] },
  { splitType: "ppl", dayLabel: "Pull", sortOrder: 1, estimatedDurationMinutes: 65, exerciseSlugs: ["deadlift", "pull-up", "barbell-row", "lat-pulldown", "face-pull", "barbell-curl"] },
  { splitType: "ppl", dayLabel: "Legs", sortOrder: 2, estimatedDurationMinutes: 70, exerciseSlugs: ["back-squat", "romanian-deadlift", "leg-press", "walking-lunge", "leg-curl"] },
  // Upper / Lower
  { splitType: "upper_lower", dayLabel: "Upper", sortOrder: 0, estimatedDurationMinutes: 60, exerciseSlugs: ["barbell-bench-press", "barbell-row", "overhead-press", "lat-pulldown", "barbell-curl", "tricep-pushdown"] },
  { splitType: "upper_lower", dayLabel: "Lower", sortOrder: 1, estimatedDurationMinutes: 60, exerciseSlugs: ["back-squat", "romanian-deadlift", "leg-press", "leg-curl", "walking-lunge"] },
  // Arnold Split
  { splitType: "arnold", dayLabel: "Chest & Back", sortOrder: 0, estimatedDurationMinutes: 70, exerciseSlugs: ["barbell-bench-press", "incline-dumbbell-press", "pull-up", "barbell-row", "cable-fly", "lat-pulldown"] },
  { splitType: "arnold", dayLabel: "Shoulders & Arms", sortOrder: 1, estimatedDurationMinutes: 65, exerciseSlugs: ["overhead-press", "lateral-raise", "barbell-curl", "close-grip-bench-press", "tricep-pushdown", "hammer-curl"] },
  { splitType: "arnold", dayLabel: "Legs", sortOrder: 2, estimatedDurationMinutes: 70, exerciseSlugs: ["back-squat", "romanian-deadlift", "leg-press", "walking-lunge", "leg-curl"] },
  // Bro Split
  { splitType: "bro_split", dayLabel: "Chest", sortOrder: 0, estimatedDurationMinutes: 55, exerciseSlugs: ["barbell-bench-press", "incline-dumbbell-press", "cable-fly", "push-up"] },
  { splitType: "bro_split", dayLabel: "Back", sortOrder: 1, estimatedDurationMinutes: 60, exerciseSlugs: ["deadlift", "pull-up", "barbell-row", "lat-pulldown"] },
  { splitType: "bro_split", dayLabel: "Shoulders", sortOrder: 2, estimatedDurationMinutes: 50, exerciseSlugs: ["overhead-press", "lateral-raise", "rear-delt-fly", "face-pull"] },
  { splitType: "bro_split", dayLabel: "Arms", sortOrder: 3, estimatedDurationMinutes: 55, exerciseSlugs: ["barbell-curl", "hammer-curl", "close-grip-bench-press", "tricep-pushdown", "skull-crusher"] },
  { splitType: "bro_split", dayLabel: "Legs", sortOrder: 4, estimatedDurationMinutes: 70, exerciseSlugs: ["back-squat", "romanian-deadlift", "leg-press", "walking-lunge", "leg-curl"] },
  // Full Body
  { splitType: "full_body", dayLabel: "Full Body", sortOrder: 0, estimatedDurationMinutes: 60, exerciseSlugs: ["back-squat", "barbell-bench-press", "barbell-row", "overhead-press", "romanian-deadlift", "hanging-leg-raise"] },
];

async function seed() {
  console.log("Seeding exercise library...");
  const slugToId = new Map<string, string>();

  const exerciseRows = EXERCISES.map((e) => {
    const id = randomUUID();
    slugToId.set(e.slug, id);
    return {
      id,
      name: e.name,
      slug: e.slug,
      primaryMuscle: e.primaryMuscle,
      equipment: e.equipment,
      defaultRepRangeLow: e.repRange[0],
      defaultRepRangeHigh: e.repRange[1],
      isCompound: e.isCompound ?? false,
    };
  });

  await db.insert(exercises).values(exerciseRows).onConflictDoNothing();
  console.log(`Inserted ${exerciseRows.length} exercises.`);

  console.log("Seeding workout templates...");
  for (const t of TEMPLATES) {
    const templateId = randomUUID();
    await db.insert(workoutTemplates).values({
      id: templateId,
      name: `${t.dayLabel}`,
      splitType: t.splitType,
      dayLabel: t.dayLabel,
      sortOrder: t.sortOrder,
      estimatedDurationMinutes: t.estimatedDurationMinutes,
      isActive: t.splitType === "ppl",
    });

    const templateExerciseRows = t.exerciseSlugs.map((slug, order) => {
      const exerciseId = slugToId.get(slug);
      if (!exerciseId) throw new Error(`Unknown exercise slug in template seed: ${slug}`);
      const exerciseDef = EXERCISES.find((e) => e.slug === slug)!;
      return {
        id: randomUUID(),
        templateId,
        exerciseId,
        order,
        targetSets: 3,
        targetRepRangeLow: exerciseDef.repRange[0],
        targetRepRangeHigh: exerciseDef.repRange[1],
        restSeconds: exerciseDef.isCompound ? 120 : 90,
      };
    });

    await db.insert(workoutTemplateExercises).values(templateExerciseRows);
  }
  console.log(`Inserted ${TEMPLATES.length} templates.`);
  console.log("Seed complete. PPL is set as the active split.");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
