import { useState, useEffect } from "react";
import { Users, UserCheck, CalendarDays, ClipboardList } from "lucide-react";
import { RootSidebar } from "../components/admin/RootSidebar";
import { StatCard } from "../components/admin/StatCard";
import { EventStatCard } from "../components/admin/EventStatCard";
import { googleSheetsService } from "../services";
import type { DashboardStats } from "../types";

export default function RootDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <div className="admin-layout">
      <RootSidebar />
      <main className="admin-main">
        <div className="admin-container">
          <div className="admin-heading">
            <div>
              <span className="eyebrow" style={{ color: "var(--red)" }}>ROOT OS</span>
              <h1>Dashboard</h1>
            </div>
          </div>

          {loading ? (
            <div className="empty-panel">
              <div className="empty-icon">
                <div className="spinner" style={{ width: 24, height: 24, border: '2px solid var(--border)', borderTopColor: 'var(--red)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
              Loading dashboard statistics...
            </div>
          ) : error ? (
            <div className="error-message" style={{ color: "var(--red)" }}>{error}</div>
          ) : stats ? (
            <>
              <div className="stat-grid">
                <StatCard
                  title="Total Registrations"
                  value={stats.totalRegistrations}
                  icon={ClipboardList}
                  trend="↑ Updated live"
                />
                <StatCard
                  title="Total Teams"
                  value={stats.totalTeams}
                  icon={UserCheck}
                />
                <StatCard
                  title="Total Students"
                  value={stats.totalStudents}
                  icon={Users}
                />
                <StatCard
                  title="Events"
                  value={stats.totalEvents}
                  icon={CalendarDays}
                  trend="Registration Open"
                />
              </div>

              <h2 className="admin-section-title">
                <ClipboardList size={20} />
                Event-wise Statistics
              </h2>
              <div className="admin-event-grid">
                {stats.eventWiseStats.map((x) => (
                  <EventStatCard key={x.eventId} stat={x} />
                ))}
              </div>
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
}
