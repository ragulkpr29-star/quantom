import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Users, ArrowRight } from "lucide-react";
import { Navbar } from "../components/sections/Navbar";
import { Footer } from "../components/sections/Footer";
import { events } from "../data/events";
import { EventCard } from "../components/ui/EventCard";

export default function EventsPage() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = gridRef.current;
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
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <header className="events-page-header">
          <div className="container">
            <span className="eyebrow">Quantum'27</span>
            <h1>Explore Events</h1>
            <p>
              Discover six carefully crafted events across technical,
              communication, cultural and entertainment categories.
            </p>
          </div>
        </header>
        <div className="events-page-body">
          <div className="container" ref={gridRef}>
            <div className="event-grid">
              {events.filter(e => !e.hidden).map((e, i) => (
                <EventCard
                  key={e.id}
                  event={e}
                  delay={Math.min(i + 1, 6) as 1 | 2 | 3 | 4 | 5 | 6}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
