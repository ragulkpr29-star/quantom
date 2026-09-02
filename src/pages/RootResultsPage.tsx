import { useEffect, useState } from "react";
import { eventService, googleSheetsService } from "../services";
import { Medal, AlertCircle } from "lucide-react";
import { RootSidebar } from "../components/admin/RootSidebar";
import type { EventConfig, ResultRecord } from "../types";

export default function RootResultsPage() {
  const allEvents = eventService.getAll();
  const [selectedEventId, setSelectedEventId] = useState<string>(allEvents[0]?.id || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [results, setResults] = useState<ResultRecord[]>([]);

  useEffect(() => {
    if (!selectedEventId) return;
    let isMounted = true;
    
    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await googleSheetsService.getResults(selectedEventId);
        
        if (isMounted) {
          setResults(res);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Unable to load results. Please try again.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    loadData();
    return () => { isMounted = false; };
  }, [selectedEventId]);

  return (
    <div className="admin-layout">
      <RootSidebar />
      <main className="admin-main">
        <div className="admin-container">
          <div className="admin-heading">
            <div>
              <span className="eyebrow" style={{ color: "var(--red)" }}>ROOT OS</span>
              <h1>Results & Leaderboard</h1>
            </div>
          </div>
          
          <div className="filters" style={{ marginBottom: "20px" }}>
            <select 
              value={selectedEventId} 
              onChange={(ev) => setSelectedEventId(ev.target.value)}
              style={{ width: '100%', maxWidth: '300px', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-alt)', color: 'var(--text)' }}
            >
              {allEvents.map((x) => (
                <option value={x.id} key={x.id}>{x.name}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="empty-panel">
              <div className="empty-icon">
                <div className="spinner" style={{ width: 24, height: 24, border: '2px solid var(--border)', borderTopColor: 'var(--red)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
              Loading results...
            </div>
          ) : error ? (
            <div className="empty-panel">
              <div className="empty-icon">
                <AlertCircle size={22} style={{ color: 'var(--red)' }} />
              </div>
              {error}
            </div>
          ) : results.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', background: 'var(--surface-alt)', borderRadius: '8px', color: 'var(--muted)', fontSize: '14px', border: '1px solid var(--border)' }}>
              <Medal size={32} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
              <p>No participants have been completely evaluated yet.</p>
            </div>
          ) : (
            <div className="winner-grid">
              {results.map((r) => (
                <div className={`winner p${r.rank}`} key={r.teamId}>
                  <span className="winner-medal">
                    {r.rank === 1 ? "🥇" : r.rank === 2 ? "🥈" : r.rank === 3 ? "🥉" : ""}
                  </span>
                  <span>
                    {r.rank}{r.rank === 1 ? "ST" : r.rank === 2 ? "ND" : r.rank === 3 ? "RD" : "TH"} PLACE
                  </span>
                  <h3>{r.teamName || r.leaderName}</h3>
                  <div className="mono" style={{ fontSize: "12px", opacity: 0.8, marginBottom: "8px" }}>{r.teamId}</div>
                  <strong>{r.total} / 100</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
