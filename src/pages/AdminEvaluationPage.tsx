import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { eventService, registrationService } from "../services";
import { Save, Medal, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/Button";

export default function AdminEvaluationPage() {
  const [p] = useSearchParams();
  const id = p.get("event") || "debate";
  const e = eventService.getById(id);
  const rs = registrationService.getByEvent(id);
  const [scores, setScores] = useState<Record<string, Record<string, number>>>(
    {}
  );
  const [saved, setSaved] = useState(false);

  if (!e) return null;

  const total = (rid: string) =>
    Object.values(scores[rid] || {}).reduce((a, b) => a + b, 0);

  const ranked = useMemo(
    () =>
      rs
        .map((r) => ({ ...r, total: total(r.registrationId) }))
        .sort((a, b) => b.total - a.total),
    [rs, scores]
  );

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-container">
          <div className="admin-heading">
            <div>
              <span className="eyebrow">Judging</span>
              <h1>Evaluation</h1>
              <p>{e.name}</p>
            </div>
          </div>

          <div className="filters" style={{ marginBottom: "20px" }}>
            <select value={e.id} onChange={() => {}}>
              {[e].map((x) => (
                <option key={x.id}>{x.name}</option>
              ))}
            </select>
            <Button onClick={handleSave} className="btn-primary">
              <Save size={16} /> Save Scores
            </Button>
          </div>

          {e.evaluationCriteria.length === 0 ? (
            <div className="empty-panel">
              <div className="empty-icon">
                <Medal size={22} />
              </div>
              Evaluation criteria will be updated from the official event
              document.
            </div>
          ) : (
            <div className="table-card">
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Participant / Team</th>
                      {e.evaluationCriteria.map((c) => (
                        <th key={c.name}>
                          {c.name}
                          <br />
                          <span
                            style={{
                              fontWeight: 600,
                              color: "var(--green-dark)",
                              fontSize: "9px",
                            }}
                          >
                            /{c.weight}
                          </span>
                        </th>
                      ))}
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rs.map((r) => (
                      <tr key={r.id}>
                        <td>
                          <strong>{r.teamName || r.leaderName}</strong>
                          <br />
                          <span
                            style={{ fontSize: "11px", color: "var(--muted)" }}
                          >
                            {r.leaderRollNo}
                          </span>
                        </td>
                        {e.evaluationCriteria.map((c) => (
                          <td key={c.name}>
                            <input
                              className="score-input"
                              type="number"
                              min="0"
                              max={c.weight}
                              value={
                                scores[r.registrationId]?.[c.name] ?? ""
                              }
                              onChange={(ev) =>
                                setScores({
                                  ...scores,
                                  [r.registrationId]: {
                                    ...(scores[r.registrationId] || {}),
                                    [c.name]: Number(ev.target.value),
                                  },
                                })
                              }
                            />
                          </td>
                        ))}
                        <td>
                          <strong
                            style={{
                              fontFamily: "Manrope",
                              fontSize: "1rem",
                              color: "var(--navy)",
                            }}
                          >
                            {total(r.registrationId)}
                          </strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <h2 className="admin-section-title">
            <Medal size={20} />
            Results
          </h2>
          <div className="winner-grid">
            {ranked.slice(0, 3).map((r, i) => (
              <div className={`winner p${i + 1}`} key={r.id}>
                <span className="winner-medal">{["🥇", "🥈", "🥉"][i]}</span>
                <span>
                  {i + 1}
                  {i === 0 ? "st" : i === 1 ? "nd" : "rd"} Place
                </span>
                <h3>{r.teamName || r.leaderName}</h3>
                <strong>{r.total}/100</strong>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Toast */}
      {saved && (
        <div className="toast">
          <CheckCircle2 size={18} />
          Scores saved successfully
        </div>
      )}
    </div>
  );
}
