import { ArrowUpRight, Users } from "lucide-react";
import { Link } from "react-router-dom";
import type { EventConfig } from "../../types";

export function EventCard({
  event,
  delay = 0,
}: {
  event: EventConfig;
  delay?: number;
}) {
  const membersLabel =
    event.participationType === "individual"
      ? "Individual"
      : event.maxMembers
        ? `${event.minMembers}–${event.maxMembers} Members`
        : "Team";

  return (
    <Link
      to={`/events/${event.id}`}
      className={`event-card reveal${delay ? ` reveal-delay-${delay}` : ""}`}
    >
      <div className="event-card-number" aria-hidden="true">
        {event.number}
      </div>
      <div className="event-card-body">
        <span className="chip">{event.category}</span>
        <h3>{event.name}</h3>
        <p>{event.description}</p>
        <div className="event-meta">
          <span className="event-meta-info">
            <Users size={14} />
            {membersLabel}
          </span>
          <span className="event-meta-arrow">
            <ArrowUpRight size={17} />
          </span>
        </div>
      </div>
    </Link>
  );
}
