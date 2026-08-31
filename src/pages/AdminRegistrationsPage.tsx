import { useMemo, useState } from "react";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { registrationService } from "../services";
import { events } from "../data/events";
import { Search, FileDown } from "lucide-react";
export default function AdminRegistrationsPage() {
  const [query, setQuery] = useState("");
  const [event, setEvent] = useState("all");
  const rs = useMemo(
    () =>
      registrationService
        .getAll()
        .filter(
          (r) =>
            (event === "all" || r.eventId === event) &&
            [r.registrationId, r.leaderName, r.leaderRollNo, r.teamName]
              .join(" ")
              .toLowerCase()
              .includes(query.toLowerCase()),
        ),
    [query, event],
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
                placeholder="Search name, roll no, registration ID…"
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
          <div className="table-card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Reg ID</th>
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
                    <tr key={r.id}>
                      <td className="mono">{r.registrationId}</td>
                      <td>{r.eventName}</td>
                      <td>
                        <strong>{r.teamName || r.leaderName}</strong>
                      </td>
                      <td>{r.leaderName}</td>
                      <td className="mono">{r.leaderRollNo}</td>
                      <td>{r.leaderPhone}</td>
                      <td>
                        <span className={`status ${r.status}`}>{r.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {rs.length === 0 && (
              <div className="empty">No registrations found.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
