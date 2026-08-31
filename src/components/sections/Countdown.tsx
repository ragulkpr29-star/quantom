import { useEffect, useRef } from "react";
import { useCountdown } from "../../hooks/useCountdown";

export function Countdown() {
  const c = useCountdown("2026-09-24T09:00:00+05:30");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
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
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const units = [
    { key: "days" as const, label: "DAYS" },
    { key: "hours" as const, label: "HOURS" },
    { key: "minutes" as const, label: "MINUTES" },
    { key: "seconds" as const, label: "SECONDS" },
  ];

  return (
    <section className="countdown-section" ref={sectionRef}>
      <div className="container">
        <div className="countdown-head reveal">
          <span className="eyebrow">Mark Your Calendar</span>
          <h2>QUANTUM'27 BEGINS IN</h2>
        </div>
        <div className="countdown-grid">
          {units.map(({ key, label }, i) => (
            <div
              className={`count-box reveal reveal-delay-${i + 1}`}
              key={key}
            >
              <strong>
                {String(c[key]).padStart(2, "0")}
              </strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
