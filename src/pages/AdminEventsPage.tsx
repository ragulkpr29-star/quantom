import { AdminSidebar } from "../components/admin/AdminSidebar";
import { events } from "../data/events";
import { adminService } from "../services";
import { FileSpreadsheet, FileText, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
export default function AdminEventsPage() {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-container">
          <div className="admin-heading">
            <div>
              <span className="eyebrow">MANAGEMENT</span>
              <h1>Events</h1>
            </div>
          </div>
          <div className="admin-event-grid two">
            {events.map((e) => {
              const s = adminService.getEventStats(e.id);
              return (
                <div className="admin-event-card" key={e.id}>
                  <div className="admin-event-top">
                    <div>
                      <span className="chip">{e.category}</span>
                      <h3>{e.name}</h3>
                    </div>
                    <span
                      className={
                        e.registrationOpen ? "status confirmed" : "status"
                      }
                    >
                      {e.registrationOpen ? "Open" : "Closed"}
                    </span>
                  </div>
                  <div className="mini-stats">
                    <div>
                      <strong>{s.totalTeams}</strong>
                      <span>Teams</span>
                    </div>
                    <div>
                      <strong>{s.totalStudents}</strong>
                      <span>Students</span>
                    </div>
                    <div>
                      <strong>{e.maxMembers ?? "TBA"}</strong>
                      <span>Max</span>
                    </div>
                  </div>
                  <div className="admin-actions">
                    <button className="btn btn-outline small">
                      <FileSpreadsheet /> Excel
                    </button>
                    <button className="btn btn-outline small">
                      <FileText /> PDF
                    </button>
                    <Link
                      to={`/admin/evaluation?event=${e.id}`}
                      className="btn btn-secondary small"
                    >
                      <Trophy /> Evaluate
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
