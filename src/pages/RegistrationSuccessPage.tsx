import { Link, useLocation } from "react-router-dom";
import { CheckCircle2, Download, Home } from "lucide-react";

export default function RegistrationSuccessPage() {
  const s = useLocation().state || {};

  return (
    <main className="success-page">
      <div className="success-card">
        <div className="success-icon-wrap">
          <CheckCircle2 strokeWidth={2} />
        </div>
        <span className="eyebrow" style={{ color: "var(--green-dark)" }}>Quantum'27</span>
        <h1>Registration Successful</h1>
        <p>
          Your registration has been recorded for{" "}
          <strong>{s.eventName || "the selected event"}</strong>.
        </p>

        <div className="success-id-box">
          <div className="success-id-label">Registration ID</div>
          <strong className="success-id-value">
            {s.registrationId || "Q27-XXXX"}
          </strong>
        </div>

        {(s.teamName || s.leaderName) && (
          <div style={{ textAlign: "left", marginBottom: "8px" }}>
            {s.eventName && (
              <div className="success-detail-row">
                <span>Event</span>
                <strong>{s.eventName}</strong>
              </div>
            )}
            {s.teamName && (
              <div className="success-detail-row">
                <span>Team</span>
                <strong>{s.teamName}</strong>
              </div>
            )}
            {s.leaderName && (
              <div className="success-detail-row">
                <span>Leader</span>
                <strong>{s.leaderName}</strong>
              </div>
            )}
          </div>
        )}

        <div className="success-actions">
          <button
            className="btn btn-outline"
            onClick={() => window.print()}
          >
            <Download size={16} />
            Print / Save
          </button>
          <Link className="btn btn-primary" to="/">
            <Home size={16} />
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
