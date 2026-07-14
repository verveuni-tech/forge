import { cn } from "@/lib/utils";

interface MetricBadgeProps {
  label: string;
  value: string;
  tone?: "default" | "success" | "warning";
}

export function MetricBadge({ label, value, tone = "default" }: MetricBadgeProps) {
  return (
    <div
      className={cn(
        "shape-capsule flex flex-col items-center gap-0.5 px-4 py-2",
        tone === "success" && "text-success",
        tone === "warning" && "text-warning",
      )}
    >
      <span className="text-h3 font-semibold tabular-nums">{value}</span>
      <span className="text-label text-muted-foreground">{label}</span>
    </div>
  );
}
