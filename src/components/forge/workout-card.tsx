interface WorkoutCardProps {
  title: string;
  subtitle?: string;
  meta?: string;
  onClick?: () => void;
}

export function WorkoutCard({ title, subtitle, meta, onClick }: WorkoutCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shape-workout-card flex w-full flex-col items-start gap-1 p-card text-left transition-transform duration-fast active:scale-[0.98]"
    >
      <h3 className="text-h3 font-semibold text-foreground">{title}</h3>
      {subtitle ? <p className="text-caption text-muted-foreground">{subtitle}</p> : null}
      {meta ? <p className="text-label text-muted-foreground">{meta}</p> : null}
    </button>
  );
}
