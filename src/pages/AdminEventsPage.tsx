import { useState, useEffect } from "react";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { events } from "../data/events";
import { googleSheetsService } from "../services";
import { FileSpreadsheet, FileText, AlertCircle } from "lucide-react";
import type { DashboardStats, EventConfig } from "../types";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function AdminEventsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    googleSheetsService.getDashboardStats()
      .then((data) => {
        if (isMounted) setStats(data);
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const handleExportExcel = async (event: EventConfig) => {
    try {
      setExporting(event.id);
      const data = await googleSheetsService.getRegistrations(event.id);
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
      XLSX.writeFile(workbook, `${event.name}_Registrations.xlsx`);
    } catch (err: any) {
      alert("Failed to export Excel: " + err.message);
    } finally {
      setExporting(null);
    }
  };

  const handleExportPDF = async (event: EventConfig) => {
    try {
      setExporting(event.id);
      const data = await googleSheetsService.getRegistrations(event.id);
      const doc = new jsPDF();
      
      doc.setFontSize(16);
      doc.text(`Quantum'27 - ${event.name} Registrations`, 14, 15);
      
      const tableColumn = ["Team ID", "Team / Leader Name", "Roll No", "Email", "Phone"];
      const tableRows = data.map(r => [
        r.teamId || r.registrationId || "",
        r.teamName || r.leaderName || "",
        r.leaderRollNo || "",
        r.leaderEmail || "",
        r.leaderPhone || ""
      ]);

      (doc as any).autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [40, 233, 140], textColor: [0, 0, 0] }
      });

      doc.save(`${event.name}_Registrations.pdf`);
    } catch (err: any) {
      alert("Failed to export PDF: " + err.message);
    } finally {
      setExporting(null);
    }
  };

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
          
          {loading ? (
             <div className="empty-panel">
               <div className="empty-icon">
                 <div className="spinner" style={{ width: 24, height: 24, border: '2px solid var(--border)', borderTopColor: 'var(--green)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                 <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
               </div>
               Loading events statistics...
             </div>
           ) : error ? (
             <div className="error-message" style={{ color: "red" }}>{error}</div>
           ) : (
            <div className="admin-event-grid two">
              {events.map((e) => {
                const s = stats?.eventWiseStats.find(st => st.eventId === e.id) || { teams: 0, students: 0 };
                const isExporting = exporting === e.id;
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
                        <strong>{s.teams}</strong>
                        <span>Teams</span>
                      </div>
                      <div>
                        <strong>{s.students}</strong>
                        <span>Students</span>
                      </div>
                      <div>
                        <strong>{e.maxMembers ?? "TBA"}</strong>
                        <span>Max</span>
                      </div>
                    </div>
                    <div className="admin-actions">
                      <button 
                        className="btn btn-outline small" 
                        onClick={() => handleExportExcel(e)}
                        disabled={isExporting}
                      >
                        <FileSpreadsheet size={16} /> {isExporting ? 'Exporting...' : 'EXCEL'}
                      </button>
                      <button 
                        className="btn btn-outline small" 
                        onClick={() => handleExportPDF(e)}
                        disabled={isExporting}
                      >
                        <FileText size={16} /> {isExporting ? 'Exporting...' : 'PDF'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
