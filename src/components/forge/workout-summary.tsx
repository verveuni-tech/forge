import { StatCard } from "./stat-card";
import { PRBadge } from "./pr-badge";
import { CoachBubble } from "./coach-bubble";

interface WorkoutSummaryProps {
  durationLabel: string;
  totalVolume: number;
  setsCompleted: number;
  exercisesCompleted: number;
  newRecords: { exerciseName: string; value: number }[];
  coachSummary: string;
}

export function WorkoutSummary({
  durationLabel,
  totalVolume,
  setsCompleted,
  exercisesCompleted,
  newRecords,
  coachSummary,
}: WorkoutSummaryProps) {
  return (
    <div className="flex flex-col gap-section px-screen py-section">
      <div className="flex flex-wrap justify-center gap-3">
        <StatCard label="Duration" value={durationLabel} />
        <StatCard label="Volume" value={`${Math.round(totalVolume)}kg`} />
        <StatCard label="Sets" value={String(setsCompleted)} />
        <StatCard label="Exercises" value={String(exercisesCompleted)} />
      </div>

      {newRecords.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-2">
          {newRecords.map((r, i) => (
            <PRBadge key={i} exerciseName={r.exerciseName} value={String(r.value)} />
          ))}
        </div>
      ) : null}

      <CoachBubble message={coachSummary} />
    </div>
  );
}
