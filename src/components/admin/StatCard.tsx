import type { LucideIcon } from "lucide-react";

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
}: {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: string;
}) {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        <Icon />
      </div>
      <strong>{value}</strong>
      <span>{title}</span>
      {trend && (
        <div
          style={{
            marginTop: "10px",
            fontSize: "11px",
            color: "var(--green-dark)",
            fontWeight: 700,
          }}
        >
          {trend}
        </div>
      )}
    </div>
  );
}
