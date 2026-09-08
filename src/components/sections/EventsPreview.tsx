import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { events } from "../../data/events";
import { EventCard } from "../ui/EventCard";

export function EventsPreview() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.querySelectorAll(".reveal").forEach((r) =>
              r.classList.add("visible")
            );
          }
        });
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section events-preview" ref={ref}>
      <div className="container">
        <div className="section-heading reveal">
          <span className="eyebrow">Explore</span>
          <h2>Six events. One Quantum.</h2>
          <p>
            Explore the rules, evaluation criteria and participation details
            before registering.
          </p>
        </div>
        <div className="event-grid">
          {events.filter(e => !e.hidden).map((e, i) => (
            <EventCard
              key={e.id}
              event={e}
              delay={Math.min(i + 1, 6) as 1 | 2 | 3 | 4 | 5 | 6}
            />
          ))}
        </div>
        <div
          style={{ textAlign: "center", marginTop: "40px" }}
          className="reveal"
        >
          <Link className="btn btn-outline" to="/events">
            View All Events{" "}
            <span className="btn-arrow">
              <ArrowRight size={16} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
