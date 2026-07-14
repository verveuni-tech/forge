import { cn } from "@/lib/utils";

export interface ExerciseTimelineItem {
  id: string;
  name: string;
  status: "done" | "current" | "upcoming";
}

interface ExerciseTimelineProps {
  items: ExerciseTimelineItem[];
  onSelect?: (id: string) => void;
}

export function ExerciseTimeline({ items, onSelect }: ExerciseTimelineProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto px-screen py-2">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect?.(item.id)}
          className={cn(
            "flex h-8 shrink-0 items-center rounded-full px-3 text-caption font-medium transition-colors duration-fast",
            item.status === "current" && "bg-primary text-primary-foreground",
            item.status === "done" && "bg-success/10 text-success",
            item.status === "upcoming" && "bg-muted text-muted-foreground",
          )}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}
