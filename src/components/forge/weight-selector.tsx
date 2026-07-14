import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, MinusSignIcon } from "@hugeicons/core-free-icons";

interface WeightSelectorProps {
  value: number;
  onChange: (value: number) => void;
  step?: number;
  unit?: string;
}

/** Stepper, never a keyboard (forge.md Principle 2) — 48x48 minimum touch targets. */
export function WeightSelector({ value, onChange, step = 2.5, unit = "kg" }: WeightSelectorProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - step))}
        aria-label="Decrease weight"
        className="flex size-12 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-transform duration-fast active:scale-90"
      >
        <HugeiconsIcon icon={MinusSignIcon} size={20} strokeWidth={2} />
      </button>
      <div className="flex w-24 flex-col items-center">
        <span className="text-display font-semibold tabular-nums text-foreground">{value}</span>
        <span className="text-label text-muted-foreground">{unit}</span>
      </div>
      <button
        type="button"
        onClick={() => onChange(value + step)}
        aria-label="Increase weight"
        className="flex size-12 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-transform duration-fast active:scale-90"
      >
        <HugeiconsIcon icon={Add01Icon} size={20} strokeWidth={2} />
      </button>
    </div>
  );
}
