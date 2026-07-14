import { useQuery } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import { Medal01Icon } from "@hugeicons/core-free-icons";
import { apiGet } from "@/lib/api";

interface PersonalRecordRow {
  id: string;
  recordType: "max_weight" | "max_reps" | "max_volume_set" | "est_1rm";
  value: string;
  achievedAt: string;
  exerciseId: string;
  exerciseName: string;
}

const RECORD_LABEL: Record<PersonalRecordRow["recordType"], string> = {
  max_weight: "Max Weight",
  max_reps: "Max Reps",
  max_volume_set: "Best Set Volume",
  est_1rm: "Estimated 1RM",
};

export function RecordsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["records"],
    queryFn: () => apiGet<PersonalRecordRow[]>("/api/records"),
  });

  return (
    <div className="flex min-h-svh flex-col gap-section px-screen py-section">
      <h1 className="text-h1 font-semibold text-foreground">Records</h1>

      {isLoading ? (
        <p className="text-caption text-muted-foreground">Loading records…</p>
      ) : isError ? (
        <p className="text-caption text-muted-foreground">
          Records will appear here once DATABASE_URL is connected.
        </p>
      ) : data && data.length > 0 ? (
        <div className="flex flex-col gap-3">
          {data.map((record) => (
            <div key={record.id} className="shape-workout-card flex items-center gap-3 p-card">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                <HugeiconsIcon icon={Medal01Icon} size={20} strokeWidth={1.75} />
              </div>
              <div className="flex-1">
                <p className="text-h3 font-medium text-foreground">{record.exerciseName}</p>
                <p className="text-caption text-muted-foreground">
                  {RECORD_LABEL[record.recordType]}
                </p>
              </div>
              <p className="text-h3 font-semibold text-foreground">{Number(record.value)}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-caption text-muted-foreground">
          No personal records yet — finish a workout to start setting them.
        </p>
      )}
    </div>
  );
}
