import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/sections/Navbar";
import { Footer } from "../components/sections/Footer";
import { events } from "../data/events";
import { Users, ArrowRight } from "lucide-react";

export default function SchedulePage() {
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.querySelectorAll(".reveal").forEach((r, i) => {
              setTimeout(() => r.classList.add("visible"), i * 90);
            });
          }
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Placeholder start time — 09:00 AM, 45 min slots (update when official schedule arrives)
  const formatTime = (index: number) => {
    const hour = 9 + Math.floor((index * 45) / 60);
    const min = (index * 45) % 60;
    const h = hour > 12 ? hour - 12 : hour;
    const ampm = hour >= 12 ? "PM" : "AM";
    return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")} ${ampm}`;
  };

  const memberLabel = (e: (typeof events)[0]) =>
    e.participationType === "individual"
      ? "Individual"
      : e.maxMembers
        ? `${e.minMembers}–${e.maxMembers} Members`
        : "Team";

  return (
    <>
      <Navbar />
      <main>
        {/* Page header */}
        <header className="schedule-page-header">
          <div className="container">
            <span className="eyebrow">Quantum'27</span>
            <h1 style={{ fontSize: "clamp(1.8rem,5vw,2.8rem)", fontWeight: 900, margin: "10px 0 0", letterSpacing: "-0.03em", color: "#fff" }}>
              Event Schedule
            </h1>
            <div className="schedule-date-block">
              <span className="day-name">Thursday</span>
              <span className="day-num">24</span>
              <span className="month-year">September · 2026</span>
            </div>
            <p className="schedule-subtitle">
              Timings and venues are indicative and will be confirmed closer to
              the event date.
            </p>
          </div>
        </header>

        {/* Body */}
        <div className="schedule-body">
          <div className="container">
            <div className="schedule-note">
              Participants must report to the respective venue 15 minutes before
              the scheduled start. Final timings will be announced officially.
            </div>

            {/* Timeline */}
            <div className="timeline" ref={timelineRef}>
              <div className="timeline-line" aria-hidden="true" />
              {events.map((e, i) => (
                <div className="timeline-row reveal" key={e.id}>
                  <div className="timeline-time">{formatTime(i)}</div>
                  <div className="timeline-node">
                    <div className="timeline-dot" />
                  </div>
                  <div className="timeline-card">
                    <div className="timeline-event-num">
                      Event {e.number} · {e.category}
                    </div>
                    <h3>{e.name}</h3>
                    <div className="timeline-card-meta">
                      <span className="timeline-card-tag">
                        <Users size={13} />
                        {memberLabel(e)}
                      </span>
                    </div>
                    <Link
                      to={`/events/${e.id}`}
                      className="timeline-card-link"
                    >
                      View Event Details{" "}
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
