interface SessionHeaderProps {
  title: string;
  elapsedLabel: string;
  onClose?: () => void;
}

export function SessionHeader({ title, elapsedLabel, onClose }: SessionHeaderProps) {
  return (
    <div className="flex items-center justify-between px-screen py-4">
      <div>
        <h1 className="text-h2 font-semibold text-foreground">{title}</h1>
        <p className="text-caption text-muted-foreground">{elapsedLabel}</p>
      </div>
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="text-caption font-medium text-muted-foreground"
        >
          End
        </button>
      ) : null}
    </div>
  );
}
