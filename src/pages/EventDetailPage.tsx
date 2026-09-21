import { useState, useEffect } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Navbar } from "../components/sections/Navbar";
import { Footer } from "../components/sections/Footer";
import { eventService } from "../services";
import { ArrowLeft, ArrowRight, CheckCircle2, Users, FileText, ExternalLink, FileDown, X, AlertCircle } from "lucide-react";

const REGISTRATION_CLOSED = true;

export default function EventDetailPage() {
  const { slug } = useParams();
  const e = eventService.getById(slug || "");

  const [showModal, setShowModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (REGISTRATION_CLOSED) {
      setShowModal(true);
      setIsClosing(false);
    }
  }, [slug]);

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setIsClosing(false);
    }, 300);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseModal();
      }
    };
    if (showModal) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showModal]);

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
      
      {/* Dynamic Keyframes for Modal */}
      <style>
        {`
          @keyframes modalFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes modalFadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
          }
          @keyframes modalScaleIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes modalScaleOut {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0; transform: scale(0.95); }
          }
        `}
      </style>

      {/* Modal */}
      {showModal && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            animation: isClosing ? "modalFadeOut 0.3s ease forwards" : "modalFadeIn 0.3s ease forwards"
          }}
        >
          {/* Backdrop */}
          <div 
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(7, 52, 74, 0.4)",
              backdropFilter: "blur(4px)"
            }}
            onClick={handleCloseModal}
          />
          
          {/* Modal Content */}
          <div 
            style={{
              background: "var(--white)",
              borderRadius: "var(--radius-lg, 20px)",
              padding: "32px",
              maxWidth: "420px",
              width: "100%",
              position: "relative",
              boxShadow: "var(--shadow-lg)",
              animation: isClosing ? "modalScaleOut 0.3s ease forwards" : "modalScaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center"
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <button 
              onClick={handleCloseModal}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--muted)",
                padding: "8px",
                display: "flex",
                borderRadius: "50%",
                transition: "background 0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.05)"}
              onMouseOut={(e) => e.currentTarget.style.background = "none"}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "rgba(239, 68, 68, 0.1)",
              color: "#ef4444",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px"
            }}>
              <AlertCircle size={32} />
            </div>

            <h2 id="modal-title" style={{ fontSize: "24px", margin: "0 0 12px 0", color: "var(--text)", fontWeight: 700 }}>
              Registration Closed
            </h2>
            
            <p style={{ color: "var(--muted)", margin: "0 0 28px 0", lineHeight: 1.6, fontSize: "15px" }}>
              Registration for this event has ended. You can still view the event details and rules &amp; guidelines.
            </p>

            <button 
              onClick={handleCloseModal}
              className="btn btn-primary btn-full"
              style={{
                background: "#ef4444",
                color: "#fff",
                border: "none",
                padding: "14px",
                borderRadius: "var(--radius-md, 12px)",
                fontWeight: 600,
                fontSize: "15px",
                cursor: "pointer",
                width: "100%",
                transition: "background 0.2s, transform 0.2s",
                boxShadow: "0 4px 12px rgba(239, 68, 68, 0.2)"
              }}
              onMouseOver={(e) => e.currentTarget.style.background = "#dc2626"}
              onMouseOut={(e) => e.currentTarget.style.background = "#ef4444"}
              onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.98)"}
              onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              OK, GOT IT
            </button>
          </div>
        </div>
      )}

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
              {REGISTRATION_CLOSED ? (
                <>
                  <p>Registration for this event has ended.</p>
                  <div style={{
                    color: "var(--red, #ef4444)",
                    fontWeight: 700,
                    fontSize: "1.25rem",
                    textAlign: "center",
                    marginTop: "24px",
                    padding: "16px",
                    border: "2px solid rgba(239, 68, 68, 0.2)",
                    borderRadius: "8px",
                    background: "rgba(239, 68, 68, 0.05)",
                    letterSpacing: "0.05em"
                  }}>
                    REGISTRATION CLOSED
                  </div>
                </>
              ) : (
                <>
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
                </>
              )}
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
