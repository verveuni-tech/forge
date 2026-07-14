import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { db, schema } from "./db";
import { estimateOneRepMax } from "../../src/lib/recommendation-engine";

interface CandidateSet {
  exerciseId: string;
  weight: number;
  reps: number;
  isWarmup: boolean;
}

type RecordType = "max_weight" | "max_reps" | "max_volume_set" | "est_1rm";

export interface NewPersonalRecord {
  exerciseId: string;
  recordType: RecordType;
  value: number;
  previousValue: number | null;
}

/** Compares this session's best sets per exercise against stored PRs, upserting any new bests. */
export async function recomputePersonalRecords(
  sessionId: string,
  sets: CandidateSet[],
): Promise<NewPersonalRecord[]> {
  const byExercise = new Map<string, CandidateSet[]>();
  for (const s of sets) {
    if (s.isWarmup) continue;
    if (!byExercise.has(s.exerciseId)) byExercise.set(s.exerciseId, []);
    byExercise.get(s.exerciseId)!.push(s);
  }

  const newRecords: NewPersonalRecord[] = [];

  for (const [exerciseId, exerciseSets] of byExercise) {
    const candidates: Array<{ recordType: RecordType; value: number }> = [
      { recordType: "max_weight", value: Math.max(...exerciseSets.map((s) => s.weight)) },
      { recordType: "max_reps", value: Math.max(...exerciseSets.map((s) => s.reps)) },
      {
        recordType: "max_volume_set",
        value: Math.max(...exerciseSets.map((s) => s.weight * s.reps)),
      },
      {
        recordType: "est_1rm",
        value: Math.max(...exerciseSets.map((s) => estimateOneRepMax(s.weight, s.reps))),
      },
    ];

    for (const candidate of candidates) {
      const [existing] = await db
        .select()
        .from(schema.personalRecords)
        .where(
          and(
            eq(schema.personalRecords.exerciseId, exerciseId),
            eq(schema.personalRecords.recordType, candidate.recordType),
          ),
        )
        .limit(1);

      const previousValue = existing ? Number(existing.value) : null;
      if (previousValue !== null && candidate.value <= previousValue) continue;

      const rowValues = {
        exerciseId,
        recordType: candidate.recordType,
        value: String(candidate.value),
        sessionId,
        previousValue: previousValue !== null ? String(previousValue) : null,
        achievedAt: new Date(),
      };

      await db
        .insert(schema.personalRecords)
        .values({ id: randomUUID(), ...rowValues })
        .onConflictDoUpdate({
          target: [schema.personalRecords.exerciseId, schema.personalRecords.recordType],
          set: rowValues,
        });

      newRecords.push({ exerciseId, recordType: candidate.recordType, value: candidate.value, previousValue });
    }
  }

  return newRecords;
}
