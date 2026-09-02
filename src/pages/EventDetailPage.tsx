import { Link, useParams, Navigate } from "react-router-dom";
import { Navbar } from "../components/sections/Navbar";
import { Footer } from "../components/sections/Footer";
import { eventService } from "../services";
import { ArrowLeft, ArrowRight, CheckCircle2, Users } from "lucide-react";

export default function EventDetailPage() {
  const { slug } = useParams();
  const e = eventService.getById(slug || "");

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
