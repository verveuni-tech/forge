import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { WorkoutCard } from "@/components/forge/workout-card";
import { apiGet, apiPost } from "@/lib/api";
import { useStartWorkout } from "@/hooks/use-start-workout";

interface TemplateExercise {
  exercise: { id: string; name: string };
}

interface Template {
  id: string;
  dayLabel: string;
  estimatedDurationMinutes: number | null;
  isActive: boolean;
  exercises: TemplateExercise[];
}

interface SplitGroup {
  splitType: string;
  templates: Template[];
}

const SPLIT_LABEL: Record<string, string> = {
  ppl: "Push Pull Legs",
  upper_lower: "Upper / Lower",
  arnold: "Arnold Split",
  bro_split: "Bro Split",
  full_body: "Full Body",
  custom: "Custom",
};

export function WorkoutTemplatesPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["templates"],
    queryFn: () => apiGet<SplitGroup[]>("/api/templates"),
  });
  const startWorkout = useStartWorkout();

  const activateMutation = useMutation({
    mutationFn: (splitType: string) => apiPost("/api/templates/activate", { splitType }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      queryClient.invalidateQueries({ queryKey: ["home"] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center px-screen">
        <p className="text-caption text-muted-foreground">Loading splits…</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-2 px-screen text-center">
        <h1 className="text-h2 font-semibold text-foreground">Workout</h1>
        <p className="max-w-xs text-caption text-muted-foreground">
          Splits will appear here once DATABASE_URL is connected.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-section px-screen py-section pb-28">
      <h1 className="text-h1 font-semibold text-foreground">Workout</h1>

      {data.map((group) => {
        const isActiveSplit = group.templates.some((t) => t.isActive);
        return (
          <section key={group.splitType} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-h3 font-medium text-foreground">
                {SPLIT_LABEL[group.splitType] ?? group.splitType}
              </h2>
              {!isActiveSplit ? (
                <button
                  type="button"
                  onClick={() => activateMutation.mutate(group.splitType)}
                  className="text-caption font-medium text-primary"
                >
                  Use this split
                </button>
              ) : (
                <span className="text-caption font-medium text-success">Active</span>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {group.templates.map((t) => (
                <WorkoutCard
                  key={t.id}
                  title={t.dayLabel}
                  subtitle={`${t.exercises.length} exercises`}
                  meta={t.estimatedDurationMinutes ? `~${t.estimatedDurationMinutes} min` : undefined}
                  onClick={() => startWorkout.mutate(t.id)}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
