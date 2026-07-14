CREATE TYPE "public"."muscle_group" AS ENUM('chest', 'back', 'legs', 'shoulders', 'arms', 'core');--> statement-breakpoint
CREATE TYPE "public"."record_type" AS ENUM('max_weight', 'max_reps', 'max_volume_set', 'est_1rm');--> statement-breakpoint
CREATE TYPE "public"."session_status" AS ENUM('in_progress', 'completed', 'abandoned');--> statement-breakpoint
CREATE TYPE "public"."split_type" AS ENUM('ppl', 'upper_lower', 'arnold', 'bro_split', 'full_body', 'custom');--> statement-breakpoint
CREATE TABLE "exercise_progress_state" (
	"exercise_id" text PRIMARY KEY NOT NULL,
	"last_weight" numeric(6, 2),
	"last_reps" jsonb,
	"last_session_id" text,
	"last_session_date" timestamp with time zone,
	"target_rep_range_low" integer,
	"target_rep_range_high" integer,
	"consecutive_sessions_at_same_weight" integer DEFAULT 0 NOT NULL,
	"plateau_detected_at" timestamp with time zone,
	"last_deload_at" timestamp with time zone,
	"last_recommendation" jsonb,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exercises" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"primary_muscle" "muscle_group" NOT NULL,
	"secondary_muscles" text[],
	"equipment" text,
	"default_rep_range_low" integer NOT NULL,
	"default_rep_range_high" integer NOT NULL,
	"is_compound" boolean DEFAULT false NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "logged_sets" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"exercise_id" text NOT NULL,
	"set_number" integer NOT NULL,
	"weight" numeric(6, 2) NOT NULL,
	"reps" integer NOT NULL,
	"rpe" numeric(3, 1),
	"is_warmup" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"estimated_one_rm" numeric(6, 2)
);
--> statement-breakpoint
CREATE TABLE "personal_records" (
	"id" text PRIMARY KEY NOT NULL,
	"exercise_id" text NOT NULL,
	"record_type" "record_type" NOT NULL,
	"value" numeric(8, 2) NOT NULL,
	"reps" integer,
	"achieved_at" timestamp with time zone DEFAULT now() NOT NULL,
	"session_id" text,
	"previous_value" numeric(8, 2)
);
--> statement-breakpoint
CREATE TABLE "workout_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"template_id" text,
	"name" text NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	"duration_seconds" integer,
	"total_volume" numeric(10, 2),
	"status" "session_status" DEFAULT 'in_progress' NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "workout_template_exercises" (
	"id" text PRIMARY KEY NOT NULL,
	"template_id" text NOT NULL,
	"exercise_id" text NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"target_sets" integer DEFAULT 3 NOT NULL,
	"target_rep_range_low" integer NOT NULL,
	"target_rep_range_high" integer NOT NULL,
	"rest_seconds" integer DEFAULT 90 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workout_templates" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"split_type" "split_type" NOT NULL,
	"day_label" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"estimated_duration_minutes" integer,
	"is_active" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "exercise_progress_state" ADD CONSTRAINT "exercise_progress_state_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_progress_state" ADD CONSTRAINT "exercise_progress_state_last_session_id_workout_sessions_id_fk" FOREIGN KEY ("last_session_id") REFERENCES "public"."workout_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "logged_sets" ADD CONSTRAINT "logged_sets_session_id_workout_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."workout_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "logged_sets" ADD CONSTRAINT "logged_sets_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personal_records" ADD CONSTRAINT "personal_records_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personal_records" ADD CONSTRAINT "personal_records_session_id_workout_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."workout_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_sessions" ADD CONSTRAINT "workout_sessions_template_id_workout_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."workout_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_template_exercises" ADD CONSTRAINT "workout_template_exercises_template_id_workout_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."workout_templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_template_exercises" ADD CONSTRAINT "workout_template_exercises_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "exercises_slug_idx" ON "exercises" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "logged_sets_session_idx" ON "logged_sets" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "logged_sets_exercise_completed_idx" ON "logged_sets" USING btree ("exercise_id","completed_at");--> statement-breakpoint
CREATE UNIQUE INDEX "pr_exercise_type_idx" ON "personal_records" USING btree ("exercise_id","record_type");--> statement-breakpoint
CREATE INDEX "sessions_status_idx" ON "workout_sessions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "wte_template_idx" ON "workout_template_exercises" USING btree ("template_id");