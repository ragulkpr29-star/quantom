import { Link, useParams, Navigate } from "react-router-dom";
import { Navbar } from "../components/sections/Navbar";
import { Footer } from "../components/sections/Footer";
import { eventService } from "../services";
import { ArrowLeft, ArrowRight, CheckCircle2, Users, FileText, ExternalLink, FileDown } from "lucide-react";


export default function EventDetailPage() {
  const { slug } = useParams();
  const e = eventService.getById(slug || "");

  if (!e) return <Navigate to="/events" replace />;

  const membersLabel =
    e.id === "IP"
      ? "Individual / 2 Members"
      : e.participationType === "individual"
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
                <p style={{ color: "var(--muted)", marginBottom: "24px", lineHeight: 1.6 }}>
                  This PDF document contains the official rules and guidelines for {e.name}. Participants are requested to read the document carefully before participating.
                </p>
                {e.rulesPdf && (
                <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
                    <div style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "12px",
                      padding: "20px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px"
                    }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                        <div style={{ 
                          background: "rgba(168, 207, 69, 0.1)", 
                          color: "var(--green)", 
                          padding: "8px", 
                          borderRadius: "8px",
                          display: "flex"
                        }}>
                          <FileText size={24} />
                        </div>
                        <div>
                          <div style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 600 }}>{e.number} — {e.name}</div>
                          <h3 style={{ fontSize: "18px", margin: "4px 0 0 0", color: "#fff" }}>Event Document</h3>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
                        <a href={e.rulesPdf} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ flex: 1, padding: "8px", fontSize: "14px", display: "flex", justifyContent: "center", gap: "8px", alignItems: "center", textDecoration: "none" }}>
                          <ExternalLink size={16} /> View
                        </a>
                        <a href={e.rulesPdf} download className="btn btn-primary" style={{ flex: 1, padding: "8px", fontSize: "14px", display: "flex", justifyContent: "center", gap: "8px", alignItems: "center", textDecoration: "none" }}>
                          <FileDown size={16} /> Download
                        </a>
                      </div>
                    </div>
                </div>
                )}
              </div>

              {e.coordinatorName && (
              <div className="detail-section">
                <h2>Student Coordinator</h2>
                <div style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "12px",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  marginTop: "16px"
                }}>
                  <div>
                    <h3 style={{ fontSize: "18px", margin: "0 0 4px 0", color: "#fff" }}>{e.coordinatorName}</h3>
                    {e.coordinatorPhone && (
                      <p style={{ margin: 0, color: "var(--muted)", display: "flex", alignItems: "center", gap: "8px" }}>
                        📞 {e.coordinatorPhone}
                      </p>
                    )}
                  </div>
                  {e.coordinatorPhone && (
                  <a href={`tel:${e.coordinatorPhone.replace(/\s+/g, '')}`} className="btn btn-primary" style={{ display: "inline-flex", justifyContent: "center", padding: "8px 16px", fontSize: "14px", textDecoration: "none" }}>
                    Call Coordinator
                  </a>
                  )}
                </div>
              </div>
              )}

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
