import { ArrowRight, Users } from "lucide-react";
import { Link } from "react-router-dom";

export interface EventStat {
  eventId: string;
  eventName: string;
  registrations: number;
  teams: number;
  students: number;
}

export function EventStatCard({ stat }: { stat: EventStat }) {
  const pct = Math.min(100, Math.round((stat.registrations / 10) * 100));
  return (
    <Link
      to={`/admin/registrations?event=${stat.eventId}`}
      className="event-stat"
    >
      <div className="event-stat-top">
        <h3>{stat.eventName}</h3>
        <ArrowRight size={18} />
      </div>
      {/* mini progress bar */}
      <div
        style={{
          height: "4px",
          background: "var(--border-light)",
          borderRadius: "999px",
          overflow: "hidden",
          margin: "10px 0 4px",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: "linear-gradient(90deg, var(--green-dark), var(--green))",
            borderRadius: "999px",
            transition: "width 0.8s ease",
          }}
        />
      </div>
      <div className="event-stat-values">
        <div>
          <strong>{stat.registrations}</strong>
          <span>Registrations</span>
        </div>
        <div>
          <strong>{stat.teams}</strong>
          <span>Teams</span>
        </div>
        <div>
          <strong>{stat.students}</strong>
          <span>Students</span>
        </div>
      </div>
      <div className="event-stat-foot">
        <Users size={14} /> View registrations
      </div>
    </Link>
  );
}
