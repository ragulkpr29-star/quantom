import { AdminSidebar } from "../components/admin/AdminSidebar";
import { events } from "../data/events";
import { FileSpreadsheet, FileText, Download } from "lucide-react";

export default function AdminExportsPage() {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-container">
          <div className="admin-heading">
            <div>
              <span className="eyebrow">Data</span>
              <h1>Exports</h1>
              <p>Download registration data by event</p>
            </div>
          </div>

          {/* All registrations export */}
          <div
            className="export-card"
            style={{ marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}
          >
            <div>
              <h3 style={{ marginBottom: "4px" }}>All Registrations</h3>
              <p style={{ margin: 0 }}>
                Export complete registration data across all events.
              </p>
            </div>
            <div className="admin-actions" style={{ margin: 0 }}>
              <button className="btn btn-primary small">
                <Download size={15} /> Export All
              </button>
            </div>
          </div>

          <h2 className="admin-section-title">
            <FileSpreadsheet size={20} />
            By Event
          </h2>

          <div className="admin-event-grid two">
            {events.map((e) => (
              <div className="export-card" key={e.id}>
                <span className="chip">Event {e.number}</span>
                <h3>{e.name}</h3>
                <p>Export registered student details for this event.</p>
                <div className="admin-actions">
                  <button className="btn btn-outline small">
                    <FileSpreadsheet size={15} /> Excel
                  </button>
                  <button className="btn btn-outline small">
                    <FileText size={15} /> PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
