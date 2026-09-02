import { useState, useEffect, useMemo } from "react";
import { RootSidebar } from "../components/admin/RootSidebar";
import { googleSheetsService } from "../services";
import { Search, History } from "lucide-react";
import type { AuditLogRecord } from "../types";

export default function RootAuditLogPage() {
  const [logs, setLogs] = useState<AuditLogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [query, setQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [selectedLog, setSelectedLog] = useState<AuditLogRecord | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    googleSheetsService.getAuditLogs()
      .then((data) => {
        if (isMounted) setLogs(data);
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchQuery = [
        log.eventId, log.eventName, log.teamId, log.teamName, log.user, log.role, log.action
      ].join(" ").toLowerCase().includes(query.toLowerCase());
      
      const matchRole = filterRole === "all" || log.role === filterRole;
      return matchQuery && matchRole;
    });
  }, [logs, query, filterRole]);

  return (
    <div className="admin-layout">
      <RootSidebar />
      <main className="admin-main">
        <div className="admin-container">
          <div className="admin-heading">
            <div>
              <span className="eyebrow" style={{ color: "var(--red)" }}>ROOT OS</span>
              <h1>Audit Log</h1>
            </div>
          </div>
          
          <div className="filters">
            <div className="search">
              <Search />
              <input
                placeholder="Search event, team, user..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
              <option value="all">All Roles</option>
              <option value="ADMIN">ADMIN</option>
              <option value="ROOT">ROOT</option>
            </select>
          </div>
          
          {error && <div className="error-message" style={{ color: "var(--red)", marginBottom: "1rem" }}>{error}</div>}

          <div style={{ display: "grid", gridTemplateColumns: selectedLog ? "2fr 1fr" : "1fr", gap: "20px" }}>
            <div className="table-card">
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>User</th>
                      <th>Role</th>
                      <th>Event</th>
                      <th>Team ID</th>
                      <th>Old Total</th>
                      <th>New Total</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((r, i) => (
                      <tr 
                        key={i} 
                        onClick={() => setSelectedLog(r)}
                        style={{ 
                          cursor: "pointer", 
                          background: selectedLog === r ? "var(--surface-alt)" : "transparent" 
                        }}
                      >
                        <td>{new Date(r.timestamp).toLocaleString()}</td>
                        <td>{r.user}</td>
                        <td><span className={`status ${r.role === 'ADMIN' ? 'confirmed' : 'pending'}`}>{r.role}</span></td>
                        <td>{r.eventName}</td>
                        <td className="mono">{r.teamId}</td>
                        <td>{r.prevTotal}</td>
                        <td><strong>{r.newTotal}</strong></td>
                        <td>
                          <button className="btn btn-outline small">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {loading && <div className="empty">Loading audit logs...</div>}
              {!loading && filteredLogs.length === 0 && (
                <div className="empty">
                  <div className="empty-icon"><History size={24} /></div>
                  No audit logs found.
                </div>
              )}
            </div>

            {selectedLog && (
              <div className="table-card" style={{ padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h3 style={{ margin: 0 }}>Audit Details</h3>
                  <button className="btn btn-outline small" onClick={() => setSelectedLog(null)}>Close</button>
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--muted)" }}>Timestamp</span>
                    <strong>{new Date(selectedLog.timestamp).toLocaleString()}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--muted)" }}>User</span>
                    <strong>{selectedLog.user} ({selectedLog.role})</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--muted)" }}>Event</span>
                    <strong>{selectedLog.eventName}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--muted)" }}>Team</span>
                    <strong>{selectedLog.teamName} ({selectedLog.teamId})</strong>
                  </div>
                  
                  <hr style={{ border: 0, borderTop: "1px solid var(--border)", margin: "10px 0" }} />
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div>
                      <h4 style={{ color: "var(--muted)", margin: "0 0 10px 0" }}>Previous Marks</h4>
                      <div style={{ background: "var(--surface-alt)", padding: "12px", borderRadius: "8px" }}>
                        <div>M1: {selectedLog.prevM1}</div>
                        <div>M2: {selectedLog.prevM2}</div>
                        <div>M3: {selectedLog.prevM3}</div>
                        <div>M4: {selectedLog.prevM4}</div>
                        <div>M5: {selectedLog.prevM5}</div>
                        <strong style={{ display: "block", marginTop: "10px" }}>Total: {selectedLog.prevTotal}</strong>
                      </div>
                    </div>
                    <div>
                      <h4 style={{ color: "var(--green)", margin: "0 0 10px 0" }}>New Marks</h4>
                      <div style={{ background: "var(--surface-alt)", padding: "12px", borderRadius: "8px" }}>
                        <div>M1: {selectedLog.newM1}</div>
                        <div>M2: {selectedLog.newM2}</div>
                        <div>M3: {selectedLog.newM3}</div>
                        <div>M4: {selectedLog.newM4}</div>
                        <div>M5: {selectedLog.newM5}</div>
                        <strong style={{ display: "block", marginTop: "10px" }}>Total: {selectedLog.newTotal}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
