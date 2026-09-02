import { useMemo, useState, useEffect } from "react";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { googleSheetsService } from "../services";
import { events } from "../data/events";
import { Search, FileDown } from "lucide-react";
import type { Registration } from "../types";

export default function AdminRegistrationsPage() {
  const [query, setQuery] = useState("");
  const [event, setEvent] = useState("all");
  const [allRegistrations, setAllRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    googleSheetsService.getRegistrations(event === "all" ? "" : event)
      .then(res => setAllRegistrations(res))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [event]);

  const rs = useMemo(
    () =>
      allRegistrations.filter(
        (r) =>
          [r.teamId, r.registrationId, r.leaderName, r.leaderRollNo, r.teamName]
            .join(" ")
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [query, allRegistrations],
  );

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-container">
          <div className="admin-heading">
            <div>
              <span className="eyebrow">MANAGEMENT</span>
              <h1>Registrations</h1>
            </div>
            <button className="btn btn-outline">
              <FileDown size={17} /> EXPORT
            </button>
          </div>
          <div className="filters">
            <div className="search">
              <Search />
              <input
                placeholder="Search name, roll no, team ID…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <select value={event} onChange={(e) => setEvent(e.target.value)}>
              <option value="all">All Events</option>
              {events.map((e) => (
                <option value={e.id} key={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>
          
          {error && <div className="error-message" style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}

          <div className="table-card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Team ID</th>
                    <th>Event</th>
                    <th>Team / Name</th>
                    <th>Leader</th>
                    <th>Roll No</th>
                    <th>Phone</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rs.map((r) => (
                    <tr key={r.id || r.teamId || r.registrationId}>
                      <td className="mono">{r.teamId || r.registrationId}</td>
                      <td>{r.eventName}</td>
                      <td>
                        <strong>{r.teamName || r.leaderName}</strong>
                      </td>
                      <td>{r.leaderName}</td>
                      <td className="mono">{r.leaderRollNo}</td>
                      <td>{r.leaderPhone}</td>
                      <td>
                        <span className={`status ${r.status || 'pending'}`}>{r.status || 'pending'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {loading && <div className="empty">Loading registrations...</div>}
            {!loading && rs.length === 0 && (
              <div className="empty">No registrations found.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
