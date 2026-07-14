import { HugeiconsIcon } from "@hugeicons/react";
import { Timer01Icon } from "@hugeicons/core-free-icons";

interface RestTimerBubbleProps {
  secondsRemaining: number;
  onSkip?: () => void;
}

/** Floating pill, auto-started by the parent after a set is saved (forge.md Principle 13). */
export function RestTimerBubble({ secondsRemaining, onSkip }: RestTimerBubbleProps) {
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  return (
    <div className="shape-capsule fixed inset-x-0 bottom-36 z-30 mx-auto flex w-fit items-center gap-3 px-5 py-3">
      <HugeiconsIcon icon={Timer01Icon} size={18} strokeWidth={1.75} className="text-primary" />
      <span className="text-h3 font-semibold tabular-nums text-foreground">
        {minutes}:{String(seconds).padStart(2, "0")}
      </span>
      {onSkip ? (
        <button type="button" onClick={onSkip} className="text-caption font-medium text-primary">
          Skip
        </button>
      ) : null}
    </div>
  );
}
