interface ScreenStubProps {
  title: string;
  description?: string;
}

/** Placeholder for a Phase 3+ screen — routed and reachable, not yet built out. */
export function ScreenStub({ title, description }: ScreenStubProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-2 px-screen text-center">
      <h1 className="text-h2 font-semibold text-foreground">{title}</h1>
      {description ? (
        <p className="max-w-xs text-caption text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
