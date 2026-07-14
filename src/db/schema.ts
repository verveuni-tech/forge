import {
  pgTable,
  pgEnum,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const muscleGroupEnum = pgEnum("muscle_group", [
  "chest",
  "back",
  "legs",
  "shoulders",
  "arms",
  "core",
]);

export const splitTypeEnum = pgEnum("split_type", [
  "ppl",
  "upper_lower",
  "arnold",
  "bro_split",
  "full_body",
  "custom",
]);

export const sessionStatusEnum = pgEnum("session_status", [
  "in_progress",
  "completed",
  "abandoned",
]);

export const recordTypeEnum = pgEnum("record_type", [
  "max_weight",
  "max_reps",
  "max_volume_set",
  "est_1rm",
]);

export const exercises = pgTable(
  "exercises",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    primaryMuscle: muscleGroupEnum("primary_muscle").notNull(),
    secondaryMuscles: text("secondary_muscles").array(),
    equipment: text("equipment"),
    defaultRepRangeLow: integer("default_rep_range_low").notNull(),
    defaultRepRangeHigh: integer("default_rep_range_high").notNull(),
    isCompound: boolean("is_compound").notNull().default(false),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("exercises_slug_idx").on(table.slug)],
);

export const workoutTemplates = pgTable("workout_templates", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  splitType: splitTypeEnum("split_type").notNull(),
  dayLabel: text("day_label").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  estimatedDurationMinutes: integer("estimated_duration_minutes"),
  isActive: boolean("is_active").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const workoutTemplateExercises = pgTable(
  "workout_template_exercises",
  {
    id: text("id").primaryKey(),
    templateId: text("template_id")
      .notNull()
      .references(() => workoutTemplates.id, { onDelete: "cascade" }),
    exerciseId: text("exercise_id")
      .notNull()
      .references(() => exercises.id),
    order: integer("order").notNull().default(0),
    targetSets: integer("target_sets").notNull().default(3),
    targetRepRangeLow: integer("target_rep_range_low").notNull(),
    targetRepRangeHigh: integer("target_rep_range_high").notNull(),
    restSeconds: integer("rest_seconds").notNull().default(90),
  },
  (table) => [index("wte_template_idx").on(table.templateId)],
);

export const workoutSessions = pgTable(
  "workout_sessions",
  {
    id: text("id").primaryKey(),
    templateId: text("template_id").references(() => workoutTemplates.id),
    name: text("name").notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    durationSeconds: integer("duration_seconds"),
    totalVolume: numeric("total_volume", { precision: 10, scale: 2 }),
    status: sessionStatusEnum("status").notNull().default("in_progress"),
    notes: text("notes"),
  },
  (table) => [index("sessions_status_idx").on(table.status)],
);

export const loggedSets = pgTable(
  "logged_sets",
  {
    id: text("id").primaryKey(),
    sessionId: text("session_id")
      .notNull()
      .references(() => workoutSessions.id, { onDelete: "cascade" }),
    exerciseId: text("exercise_id")
      .notNull()
      .references(() => exercises.id),
    setNumber: integer("set_number").notNull(),
    weight: numeric("weight", { precision: 6, scale: 2 }).notNull(),
    reps: integer("reps").notNull(),
    rpe: numeric("rpe", { precision: 3, scale: 1 }),
    isWarmup: boolean("is_warmup").notNull().default(false),
    completedAt: timestamp("completed_at", { withTimezone: true }).notNull().defaultNow(),
    estimatedOneRm: numeric("estimated_one_rm", { precision: 6, scale: 2 }),
  },
  (table) => [
    index("logged_sets_session_idx").on(table.sessionId),
    index("logged_sets_exercise_completed_idx").on(table.exerciseId, table.completedAt),
  ],
);

export const personalRecords = pgTable(
  "personal_records",
  {
    id: text("id").primaryKey(),
    exerciseId: text("exercise_id")
      .notNull()
      .references(() => exercises.id),
    recordType: recordTypeEnum("record_type").notNull(),
    value: numeric("value", { precision: 8, scale: 2 }).notNull(),
    reps: integer("reps"),
    achievedAt: timestamp("achieved_at", { withTimezone: true }).notNull().defaultNow(),
    sessionId: text("session_id").references(() => workoutSessions.id),
    previousValue: numeric("previous_value", { precision: 8, scale: 2 }),
  },
  (table) => [uniqueIndex("pr_exercise_type_idx").on(table.exerciseId, table.recordType)],
);

export const exerciseProgressState = pgTable("exercise_progress_state", {
  exerciseId: text("exercise_id")
    .primaryKey()
    .references(() => exercises.id),
  lastWeight: numeric("last_weight", { precision: 6, scale: 2 }),
  lastReps: jsonb("last_reps").$type<number[]>(),
  lastSessionId: text("last_session_id").references(() => workoutSessions.id),
  lastSessionDate: timestamp("last_session_date", { withTimezone: true }),
  targetRepRangeLow: integer("target_rep_range_low"),
  targetRepRangeHigh: integer("target_rep_range_high"),
  consecutiveSessionsAtSameWeight: integer("consecutive_sessions_at_same_weight")
    .notNull()
    .default(0),
  plateauDetectedAt: timestamp("plateau_detected_at", { withTimezone: true }),
  lastDeloadAt: timestamp("last_deload_at", { withTimezone: true }),
  lastRecommendation: jsonb("last_recommendation").$type<{
    action: string;
    suggestedWeight: number;
    suggestedReps: [number, number];
    reason: string;
    generatedAt: string;
  }>(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
