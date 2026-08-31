import { useEffect, useRef } from "react";
import { CalendarDays, Layers, Users } from "lucide-react";

const stats = [
  {
    num: "24",
    label: "September 2026",
    sub: "Event Day",
    icon: CalendarDays,
  },
  {
    num: "06",
    label: "Main Events",
    sub: "Technical, Cultural & More",
    icon: Layers,
  },
  {
    num: "UG",
    label: "Computer Technology",
    sub: "Department of KEC",
    icon: Users,
  },
];

export function About() {
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
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section about" ref={ref}>
      <div className="container about-grid">
        <div>
          <span className="about-label reveal">About Quantum'27</span>
          <h2 className="about-title reveal reveal-delay-1">
            Where technology meets talent.
          </h2>
          <p className="about-desc reveal reveal-delay-2">
            Quantum'27 is an intra-department fest organized by the Department
            of Computer Technology&nbsp;– UG, Kongu Engineering College, bringing
            students together through technical, communication, creative and
            entertainment-based events.
          </p>
        </div>
        <div className="about-stats">
          {stats.map(({ num, label, sub, icon: Icon }, i) => (
            <div
              className={`about-stat-item reveal reveal-delay-${i + 1}`}
              key={num}
            >
              <div className="about-stat-icon">
                <Icon size={20} />
              </div>
              <div>
                <div className="about-stat-num">{num}</div>
                <div className="about-stat-label">{label}</div>
                <div className="about-stat-sublabel">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
