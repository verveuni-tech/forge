interface StatCardProps {
  label: string;
  value: string;
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="shape-stat-hex flex flex-col items-center gap-1 px-4 py-5">
      <span className="text-h1 font-semibold tabular-nums text-foreground">{value}</span>
      <span className="text-label text-muted-foreground">{label}</span>
    </div>
  );
}
