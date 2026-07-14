import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { WorkoutCard } from "@/components/forge/workout-card";
import { RecommendationPanel } from "@/components/forge/recommendation-panel";
import { ProgressModule } from "@/components/forge/progress-module";
import { MetricBadge } from "@/components/forge/metric-badge";
import { PRBadge } from "@/components/forge/pr-badge";
import { apiGet } from "@/lib/api";
import { useStartWorkout } from "@/hooks/use-start-workout";
import type { Recommendation } from "@/lib/recommendation-engine";

interface TodayTemplate {
  id: string;
  dayLabel: string;
  estimatedDurationMinutes: number | null;
  exerciseCount: number;
}

interface RecentPr {
  exerciseName: string;
  value: string;
  recordType: string;
}

interface HomeData {
  todayTemplate: TodayTemplate | null;
  streak: number;
  weeklyProgressPercent: number;
  recentPr: RecentPr | null;
  coachTeaser: Recommendation | null;
}

export function HomePage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["home"],
    queryFn: () => apiGet<HomeData>("/api/home"),
  });
  const startWorkout = useStartWorkout();

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center px-screen">
        <p className="text-caption text-muted-foreground">Loading today's plan…</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-2 px-screen text-center">
        <h1 className="text-h2 font-semibold text-foreground">Forge</h1>
        <p className="max-w-xs text-caption text-muted-foreground">
          Can't reach the coach yet — connect DATABASE_URL to bring your plan to life.
        </p>
      </div>
    );
  }

  const { todayTemplate, streak, weeklyProgressPercent, recentPr, coachTeaser } = data;

  return (
    <div className="flex flex-col gap-section px-screen py-section">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-caption text-muted-foreground">Today's Workout</p>
          <h1 className="text-h1 font-semibold text-foreground">
            {todayTemplate?.dayLabel ?? "Rest day"}
          </h1>
        </div>
        {streak > 0 ? <MetricBadge label="streak" value={String(streak)} tone="success" /> : null}
      </header>

      {todayTemplate ? (
        <WorkoutCard
          title={todayTemplate.dayLabel}
          subtitle={`${todayTemplate.exerciseCount} exercises`}
          meta={
            todayTemplate.estimatedDurationMinutes
              ? `~${todayTemplate.estimatedDurationMinutes} min`
              : undefined
          }
        />
      ) : (
        <p className="text-caption text-muted-foreground">
          No active split yet — pick one from the Workout tab.
        </p>
      )}

      {coachTeaser ? (
        <RecommendationPanel
          action={coachTeaser.action}
          suggestedWeight={coachTeaser.suggestedWeight}
          suggestedReps={coachTeaser.suggestedReps}
          reason={coachTeaser.reason}
        />
      ) : null}

      <ProgressModule label="Weekly Progress" percent={weeklyProgressPercent} />

      {recentPr ? (
        <div className="flex justify-center">
          <PRBadge exerciseName={recentPr.exerciseName} value={String(Number(recentPr.value))} />
        </div>
      ) : null}

      {todayTemplate ? (
        <Button
          size="lg"
          className="mt-2 w-full"
          disabled={startWorkout.isPending}
          onClick={() => startWorkout.mutate(todayTemplate.id)}
        >
          {startWorkout.isPending ? "Starting…" : "Start Workout"}
        </Button>
      ) : null}
    </div>
  );
}
