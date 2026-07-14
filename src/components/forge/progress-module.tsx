interface ProgressModuleProps {
  label: string;
  percent: number;
}

/** Wide, low-height, graph-first (forge.md Geometry System) — Home only. */
export function ProgressModule({ label, percent }: ProgressModuleProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div className="shape-workout-card p-card">
      <div className="flex items-center justify-between">
        <span className="text-caption text-muted-foreground">{label}</span>
        <span className="text-h3 font-semibold text-foreground">{Math.round(clamped)}%</span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-slow ease-spring"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
