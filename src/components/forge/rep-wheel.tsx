import { cn } from "@/lib/utils";

interface RepWheelProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

/** Tap-to-select scroll-snap strip, never a keyboard (forge.md Principle 2). */
export function RepWheel({ value, onChange, min = 1, max = 20 }: RepWheelProps) {
  const options = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  return (
    <div className="scrollbar-none flex snap-x snap-mandatory items-center gap-2 overflow-x-auto px-8 py-2">
      {options.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={cn(
            "flex size-12 shrink-0 snap-center items-center justify-center rounded-full text-h3 font-semibold transition-colors duration-fast",
            n === value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
          )}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
