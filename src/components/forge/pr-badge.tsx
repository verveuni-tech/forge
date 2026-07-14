import { HugeiconsIcon } from "@hugeicons/react";
import { Medal01Icon } from "@hugeicons/core-free-icons";

interface PRBadgeProps {
  exerciseName: string;
  value: string;
}

export function PRBadge({ exerciseName, value }: PRBadgeProps) {
  return (
    <div className="shape-capsule flex items-center gap-2 px-4 py-2 text-success">
      <HugeiconsIcon icon={Medal01Icon} size={16} strokeWidth={1.75} />
      <span className="text-caption font-medium">{exerciseName}</span>
      <span className="text-caption font-semibold">{value}</span>
    </div>
  );
}
