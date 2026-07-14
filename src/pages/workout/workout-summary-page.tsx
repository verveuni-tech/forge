import { useLocation, useNavigate } from "react-router";
import { WorkoutSummary } from "@/components/forge/workout-summary";
import { Button } from "@/components/ui/button";

interface NewRecord {
  exerciseId: string;
  recordType: string;
  value: number;
  exerciseName?: string;
}

interface SessionSummary {
  totalVolume: number;
  setsCompleted: number;
  exercisesCompleted: number;
  newRecords: NewRecord[];
  coachSummary: string;
}

interface SummaryLocationState {
  summary: SessionSummary;
  durationSeconds: number;
}

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function WorkoutSummaryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as SummaryLocationState | null;

  if (!state) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-screen text-center">
        <h1 className="text-h2 font-semibold text-foreground">Workout finished</h1>
        <p className="max-w-xs text-caption text-muted-foreground">
          Summary details aren't available for this session anymore.
        </p>
        <Button size="lg" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </div>
    );
  }

  const { summary, durationSeconds } = state;

  return (
    <div className="flex min-h-svh flex-col gap-6 pb-12">
      <header className="px-screen pt-section text-center">
        <h1 className="text-h1 font-semibold text-foreground">Workout Complete</h1>
      </header>

      <WorkoutSummary
        durationLabel={formatDuration(durationSeconds)}
        totalVolume={summary.totalVolume}
        setsCompleted={summary.setsCompleted}
        exercisesCompleted={summary.exercisesCompleted}
        newRecords={summary.newRecords.map((r) => ({
          exerciseName: r.exerciseName ?? "PR",
          value: r.value,
        }))}
        coachSummary={summary.coachSummary}
      />

      <div className="px-screen">
        <Button size="lg" className="w-full" onClick={() => navigate("/")}>
          Finish
        </Button>
      </div>
    </div>
  );
}
