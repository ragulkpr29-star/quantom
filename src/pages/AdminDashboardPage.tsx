import { Users, UserCheck, CalendarDays, ClipboardList } from "lucide-react";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { StatCard } from "../components/admin/StatCard";
import { EventStatCard } from "../components/admin/EventStatCard";
import { adminService } from "../services";

export default function AdminDashboardPage() {
  const s = adminService.getStats();

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-container">
          <div className="admin-heading">
            <div>
              <span className="eyebrow">Quantum'27</span>
              <h1>Dashboard</h1>
              <p>Event management and registration overview</p>
            </div>
            <span className="admin-status">UI DEMO</span>
          </div>

          <div className="stat-grid">
            <StatCard
              title="Total Registrations"
              value={s.totalRegistrations}
              icon={ClipboardList}
              trend="↑ Updated today"
            />
            <StatCard
              title="Total Teams"
              value={s.totalTeams}
              icon={UserCheck}
            />
            <StatCard
              title="Total Students"
              value={s.totalStudents}
              icon={Users}
            />
            <StatCard
              title="Events"
              value={s.totalEvents}
              icon={CalendarDays}
              trend="Registration Open"
            />
          </div>

          <h2 className="admin-section-title">
            <ClipboardList size={20} />
            Event-wise Statistics
          </h2>
          <div className="admin-event-grid">
            {s.eventWiseStats.map((x) => (
              <EventStatCard key={x.eventId} stat={x} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
