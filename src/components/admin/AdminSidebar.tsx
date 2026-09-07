import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Trophy,
  History,
  LogOut,
} from "lucide-react";

const items = [
  ["Dashboard", "/admin", LayoutDashboard],
  ["Registrations", "/admin/registrations", Users],
  ["Events", "/admin/events", Calendar],
  ["Evaluation", "/admin/evaluation", Trophy],
  ["Audit Log", "/admin/audit-log", History],
] as const;

export function AdminSidebar() {
  const loc = useLocation();
  const nav = useNavigate();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (err) {
      // Ignore network errors on logout
    }
    nav("/admin-login");
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-inner">
        <div className="admin-brand">
          <strong>QUANTUM'27</strong>
          <span>Administration</span>
        </div>
        <nav>
          {items.map(([label, href, Icon]) => (
            <Link
              key={href}
              to={href}
              className={loc.pathname === href ? "active" : ""}
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>
        <a href="#" className="exit" onClick={handleLogout}>
          <LogOut size={17} />
          Log Out
        </a>
      </div>
    </aside>
  );
}
