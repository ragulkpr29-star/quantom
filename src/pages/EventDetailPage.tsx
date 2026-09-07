import { Link, useParams, Navigate } from "react-router-dom";
import { Navbar } from "../components/sections/Navbar";
import { Footer } from "../components/sections/Footer";
import { eventService } from "../services";
import { ArrowLeft, ArrowRight, CheckCircle2, Users, FileText, ExternalLink, FileDown } from "lucide-react";

const rulesData = [
  { num: "01", name: "Project Buzz", desc: "Project Presentation", file: "/assets/rules%20-%20Project.pdf" },
  { num: "02", name: "Paper Fusion", desc: "Paper Presentation", file: "/assets/Rules%20paper%20(1).pdf" },
  { num: "03", name: "Web Jam", desc: "Codeless Web Development", file: "/assets/Rules%20-%20web%20development.pdf" },
  { num: "04", name: "Bid Boss", desc: "IPL Auction", file: "/assets/rules%20ipl%20auction%20edit.pdf" },
  { num: "05", name: "Vox Pop", desc: "Debate", file: "/assets/rules%20debate(2).pdf" }
];

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
                  These PDF documents contain the official rules and guidelines for Quantum’27 events. Participants are requested to read the respective document carefully before participating.
                </p>
                <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
                  {rulesData.map((rule, idx) => (
                    <div key={idx} style={{
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
                          <div style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 600 }}>{rule.num} — {rule.name}</div>
                          <h3 style={{ fontSize: "18px", margin: "4px 0 0 0", color: "#fff" }}>{rule.desc}</h3>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
                        <a href={rule.file} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ flex: 1, padding: "8px", fontSize: "14px", display: "flex", justifyContent: "center", gap: "8px", alignItems: "center", textDecoration: "none" }}>
                          <ExternalLink size={16} /> View
                        </a>
                        <a href={rule.file} download className="btn btn-primary" style={{ flex: 1, padding: "8px", fontSize: "14px", display: "flex", justifyContent: "center", gap: "8px", alignItems: "center", textDecoration: "none" }}>
                          <FileDown size={16} /> Download
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
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
