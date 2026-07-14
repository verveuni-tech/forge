import { cn } from "@/lib/utils";

interface MuscleChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}

export function MuscleChip({ label, selected, onClick }: MuscleChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-8 shrink-0 rounded-full border px-3 text-caption font-medium transition-colors duration-fast",
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border text-muted-foreground",
      )}
    >
      {label}
    </button>
  );
}
