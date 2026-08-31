import { useEffect, useRef } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Navbar } from "../components/sections/Navbar";
import { Footer } from "../components/sections/Footer";
import { eventService } from "../services";
import { ArrowLeft, ArrowRight, CheckCircle2, Users } from "lucide-react";

export default function EventDetailPage() {
  const { slug } = useParams();
  const e = eventService.getById(slug || "");
  const criteriaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = criteriaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.querySelectorAll<HTMLElement>(".criteria-bar-fill").forEach(
              (bar) => bar.classList.add("animated")
            );
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [e]);

  if (!e) return <Navigate to="/events" replace />;

  const membersLabel =
    e.participationType === "individual"
      ? "Individual"
      : e.maxMembers
        ? `${e.minMembers}–${e.maxMembers} Members`
        : "Team size TBA";

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--surface)" }}>
        <div className="container" style={{ paddingTop: "40px", paddingBottom: "64px" }}>
          {/* Back */}
          <Link className="back-link" to="/events">
            <ArrowLeft size={14} /> Back to Events
          </Link>

          {/* Event hero */}
          <div className="event-hero">
            <span className="chip chip-navy" style={{ background: "rgba(168,207,69,0.15)", color: "#b8e04a" }}>
              EVENT {e.number} · {e.category}
            </span>
            <h1>{e.name}</h1>
            <p>{e.description}</p>
            <div className="event-detail-meta">
              <span>
                <Users />
                {membersLabel}
              </span>
              <span>
                <CheckCircle2 />
                UG Computer Technology
              </span>
            </div>
          </div>

          {/* Detail grid */}
          <div className="detail-grid">
            <section className="detail-main">
              <div className="detail-section">
                <h2>Eligibility</h2>
                <p>{e.eligibility}</p>
              </div>

              <div className="detail-section">
                <h2>Rules &amp; Guidelines</h2>
                <ol className="rules-list">
                  {e.rules.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ol>
              </div>

              <div className="detail-section">
                <h2>Important Instructions</h2>
                <ul className="bullet-list">
                  {e.instructions.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              {e.evaluationCriteria.length > 0 && (
                <div className="detail-section" ref={criteriaRef}>
                  <h2>Evaluation Criteria</h2>
                  <div className="criteria-bars">
                    {e.evaluationCriteria.map((c) => (
                      <div className="criteria-bar-item" key={c.name}>
                        <div className="criteria-bar-header">
                          <span className="criteria-bar-name">{c.name}</span>
                          <span className="criteria-bar-pct">{c.weight}%</span>
                        </div>
                        <div className="criteria-bar-track">
                          <div
                            className="criteria-bar-fill"
                            style={
                              {
                                "--pct": `${c.weight}%`,
                              } as React.CSSProperties
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* CTA sidebar */}
            <aside className="detail-cta">
              <span className="eyebrow">Ready?</span>
              <h3>Register for this Event</h3>
              <p>
                Read all the event information, then complete your registration
                before 21 September 2026.
              </p>
              <Link className="btn btn-primary btn-full" to={`/register/${e.id}`}>
                Continue to Registration{" "}
                <span className="btn-arrow">
                  <ArrowRight size={16} />
                </span>
              </Link>
              <p className="deadline-note">Registration closes 21 Sep 2026</p>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
