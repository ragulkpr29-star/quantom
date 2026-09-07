import { useEffect, useState } from "react";
import { eventService, googleSheetsService } from "../services";
import { Medal, CheckCircle2, AlertCircle } from "lucide-react";
import { RootSidebar } from "../components/admin/RootSidebar";
import type { EvaluationRecord, Registration, EventConfig, Criterion, ResultRecord } from "../types";

export default function RootEvaluationPage() {
  const allEvents = eventService.getAll();
  const [selectedEventId, setSelectedEventId] = useState<string>(allEvents[0]?.id || "");
  console.log("Selected event ID:", selectedEventId);
  console.log("All events:", allEvents);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [e, setE] = useState<EventConfig | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [evalsList, setEvalsList] = useState<any[]>([]);
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [results, setResults] = useState<ResultRecord[]>([]);

  const [draftScores, setDraftScores] = useState<Record<string, Record<string, number>>>({});
  const [saveStatus, setSaveStatus] = useState<Record<string, "saving" | "saved" | "error" | undefined>>({});

  // Load data when event changes
  useEffect(() => {
    if (!selectedEventId) return;
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        const ev = eventService.getById(selectedEventId);
        if (!ev) throw new Error("Event not found");

        const [allRegs, evals, crit, res] = await Promise.all([
          googleSheetsService.getRegistrations(""),
          googleSheetsService.getEvaluations(selectedEventId),
          googleSheetsService.getCriteria(selectedEventId),
          googleSheetsService.getResults(selectedEventId)
        ]);

        const regs = allRegs.filter((r: any) => r.eventId === selectedEventId);

        if (isMounted) {
          setE(ev);
          setRegistrations(regs);
          setEvalsList(evals);
          setCriteria(crit);
          setResults(res);

          // Initialize draft scores from fetched evals
          const initialDrafts: Record<string, Record<string, number>> = {};
          const evalsMap = new Map();
          evals.forEach((r: any) => {
            if (r.teamId) evalsMap.set(r.teamId, r);
          });

          regs.forEach((r: Registration) => {
            const teamId = r.teamId || r.registrationId;
            if (teamId) {
              const existingEval = evalsMap.get(teamId);
              if (existingEval) {
                initialDrafts[teamId] = {
                  [crit[0]?.name]: typeof existingEval.m1 === 'number' ? existingEval.m1 : NaN,
                  [crit[1]?.name]: typeof existingEval.m2 === 'number' ? existingEval.m2 : NaN,
                  [crit[2]?.name]: typeof existingEval.m3 === 'number' ? existingEval.m3 : NaN,
                  [crit[3]?.name]: typeof existingEval.m4 === 'number' ? existingEval.m4 : NaN,
                  [crit[4]?.name]: typeof existingEval.m5 === 'number' ? existingEval.m5 : NaN,
                };
              }
            }
          });
          setDraftScores(initialDrafts);
          setSaveStatus({});
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Unable to load participants. Please try again.");
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

  const handleScoreChange = (teamId: string, criterionName: string, value: string, max: number) => {
    let numValue = parseInt(value, 10);
    if (isNaN(numValue)) numValue = 0;

    // Prevent negative and above max
    if (numValue < 0) numValue = 0;
    if (numValue > max) numValue = max;
    const finalValue = value === "" ? NaN : numValue;

    setDraftScores(prev => ({
      ...prev,
      [teamId]: {
        ...(prev[teamId] || {}),
        [criterionName]: finalValue,
      }
    }));
  };

  const getDraftTotal = (teamId: string) => {
    const pScores = draftScores[teamId] || {};
    return criteria.reduce((sum, c) => {
      const val = pScores[c.name];
      return sum + (isNaN(val) ? 0 : val);
    }, 0);
  };

  const isValidRow = (teamId: string) => {
    if (criteria.length === 0) return false;
    const pScores = draftScores[teamId] || {};
    return criteria.every(c => {
      const val = pScores[c.name];
      return typeof val === 'number' && !isNaN(val) && val >= 0 && val <= c.weight;
    });
  };

  const handleSaveRow = async (teamId: string) => {
    if (!e || !isValidRow(teamId)) return;

    setSaveStatus(prev => ({ ...prev, [teamId]: "saving" }));

    try {
      const scores = draftScores[teamId];
      const payload: any = {
        eventId: e.id,
        teamId,
        user: "root_user",
        role: "ROOT"
      };

      criteria.forEach((c, i) => {
        payload[`m${i + 1}`] = scores[c.name];
      });

      await googleSheetsService.saveMarks(payload);

      const [newEvals, newRes] = await Promise.all([
        googleSheetsService.getEvaluations(e.id),
        googleSheetsService.getResults(e.id)
      ]);
      setEvalsList(newEvals);
      setResults(newRes);

      setSaveStatus(prev => ({ ...prev, [teamId]: "saved" }));
      setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, [teamId]: undefined }));
      }, 3000);

    } catch (err) {
      setSaveStatus(prev => ({ ...prev, [teamId]: "error" }));
    }
  };

  return (
    <div className="admin-layout">
      <RootSidebar />
      <main className="admin-main">
        <div className="admin-container">
          <div className="admin-heading">
            <div>
              <span className="eyebrow" style={{ color: "var(--red)" }}>ROOT OS</span>
              <h1>Evaluation Engine</h1>
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
                <div className="spinner" style={{ width: 24, height: 24, border: '2px solid var(--border)', borderTopColor: 'var(--green)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
              Loading participants...
            </div>
          ) : error ? (
            <div className="empty-panel">
              <div className="empty-icon">
                <AlertCircle size={22} style={{ color: 'var(--red)' }} />
              </div>
              {error}
            </div>
          ) : registrations.length === 0 ? (
            <div className="empty-panel">
              <div className="empty-icon">
                <Medal size={22} />
              </div>
              No registered participants for this event.
            </div>
          ) : e ? (
            <>
              {criteria.length === 0 && (
                <div className="empty-panel" style={{ marginBottom: '20px' }}>
                  <div className="empty-icon">
                    <Medal size={22} />
                  </div>
                  Evaluation criteria are not configured for this event.
                </div>
              )}

              {/* Criteria Legend */}
              {criteria.length > 0 && (
                <div style={{ marginBottom: '16px', background: 'var(--surface-alt)', padding: '12px 16px', borderRadius: '8px', fontSize: '13px', display: 'flex', gap: '16px', flexWrap: 'wrap', border: '1px solid var(--border)' }}>
                  {criteria.map((c, i) => (
                    <div key={c.name}>
                      <strong style={{ color: 'var(--green)' }}>M{i + 1}</strong> — {c.name} ({c.weight})
                    </div>
                  ))}
                </div>
              )}

              <div className="table-card">
                <div className="table-wrap" style={{ overflowX: 'auto' }}>
                  <table style={{ minWidth: '800px', width: '100%' }}>
                    <thead>
                      <tr>
                        <th style={{ width: '250px' }}>TEAM / PARTICIPANT</th>
                        {criteria.map((c, i) => (
                          <th key={c.name} style={{ textAlign: 'center', width: '80px' }}>
                            M{i + 1}
                          </th>
                        ))}
                        <th style={{ textAlign: 'center', width: '80px' }}>TOTAL</th>
                        <th style={{ textAlign: 'right', width: '120px' }}>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.map((r) => {
                        const tId = r.teamId || r.registrationId;
                        if (!tId) return null;
                        const isSaving = saveStatus[tId] === "saving";
                        const isSaved = saveStatus[tId] === "saved";
                        const isError = saveStatus[tId] === "error";
                        const valid = isValidRow(tId);

                        return (
                          <tr key={tId}>
                            <td>
                              <strong>{r.teamName || r.leaderName}</strong>
                              <br />
                              <span style={{ fontSize: "11px", color: "var(--muted)" }}>
                                {tId}
                              </span>
                            </td>
                            {criteria.map((c) => {
                              const val = draftScores[tId]?.[c.name];
                              return (
                                <td key={c.name} style={{ textAlign: 'center' }}>
                                  <input
                                    className="score-input"
                                    type="number"
                                    min="0"
                                    max={c.weight}
                                    style={{ width: '60px', textAlign: 'center', margin: '0 auto', display: 'block', padding: '6px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--surface)' }}
                                    value={val !== undefined && !isNaN(val) ? val : ""}
                                    onChange={(ev) => handleScoreChange(tId, c.name, ev.target.value, c.weight)}
                                    disabled={isSaving}
                                  />
                                </td>
                              );
                            })}
                            <td style={{ textAlign: 'center' }}>
                              <strong style={{ fontFamily: "Manrope", fontSize: "1rem", color: "var(--navy)" }}>
                                {getDraftTotal(tId)}
                              </strong>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                                {isSaved && <span style={{ color: 'var(--green)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={14} /> Saved</span>}
                                {isError && <span style={{ color: 'var(--red)', fontSize: '12px' }}>Failed</span>}
                                <button
                                  className="btn btn-primary"
                                  style={{ padding: '6px 16px', fontSize: '12px', opacity: (!valid || isSaving || isSaved || criteria.length === 0) ? 0.5 : 1, cursor: (!valid || isSaving || isSaved || criteria.length === 0) ? 'not-allowed' : 'pointer' }}
                                  disabled={!valid || isSaving || isSaved || criteria.length === 0}
                                  onClick={() => handleSaveRow(tId)}
                                >
                                  {isSaving ? 'SAVING...' : 'SAVE'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <h2 className="admin-section-title" style={{ marginTop: '40px' }}>
                <Medal size={20} />
                Results
              </h2>
              {results.length === 0 ? (
                <div style={{ padding: '24px', background: 'var(--surface-alt)', borderRadius: '8px', color: 'var(--muted)', fontSize: '14px', border: '1px solid var(--border)' }}>
                  No participants have been completely evaluated yet.
                </div>
              ) : (
                <div className="winner-grid">
                  {results.slice(0, 5).map((r) => (
                    <div className={`winner p${r.rank}`} key={r.teamId}>
                      <span className="winner-medal">
                        {r.rank === 1 ? "🥇" : r.rank === 2 ? "🥈" : r.rank === 3 ? "🥉" : ""}
                      </span>
                      <span>
                        {r.rank}{r.rank === 1 ? "ST" : r.rank === 2 ? "ND" : r.rank === 3 ? "RD" : "TH"} PLACE
                      </span>
                      <h3>{r.teamName || r.leaderName}</h3>
                      <strong>{r.total} / 100</strong>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
}
