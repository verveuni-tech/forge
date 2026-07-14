interface CoachBubbleProps {
  message: string;
}

export function CoachBubble({ message }: CoachBubbleProps) {
  return (
    <div className="shape-coach-bubble mx-auto max-w-sm p-card">
      <p className="text-body text-foreground">{message}</p>
    </div>
  );
}
