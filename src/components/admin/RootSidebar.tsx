import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Trophy,
  History,
  LogOut,
  Medal,
} from "lucide-react";

const items = [
  ["Dashboard", "/root-os/dashboard", LayoutDashboard],
  ["Evaluation", "/root-os/evaluation", Trophy],
  ["Results", "/root-os/results", Medal],
  ["Audit Log", "/root-os/audit-log", History],
] as const;

export function RootSidebar() {
  const loc = useLocation();
  const nav = useNavigate();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (err) {
      // Ignore network errors on logout
    }
    nav("/root-os");
  };

  return (
    <aside className="admin-sidebar root-sidebar" style={{ borderRight: "1px solid var(--border)", background: "var(--surface)" }}>
      <style>{`
        .root-sidebar nav a, .root-sidebar .exit {
          color: var(--muted);
        }
        .root-sidebar nav a:hover, .root-sidebar .exit:hover {
          color: var(--navy);
          background: rgba(0, 0, 0, 0.04);
        }
        .root-sidebar nav a.active {
          color: var(--navy-dark);
          background: var(--green);
        }
      `}</style>
      <div className="admin-sidebar-inner">
        <div className="admin-brand">
          <strong style={{ color: "var(--navy)" }}>QUANTUM'27</strong>
          <span style={{ color: "var(--red)" }}>ROOT OS</span>
        </div>
        <nav>
          {items.map(([label, href, Icon]) => (
            <Link
              key={href}
              to={href}
              className={loc.pathname.startsWith(href) ? "active" : ""}
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>
        <a href="#" className="exit" onClick={handleLogout}>
          <LogOut size={17} />
          Sign Out
        </a>
      </div>
    </aside>
  );
}
