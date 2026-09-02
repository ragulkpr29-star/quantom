import { Link, useLocation } from "react-router-dom";
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
  return (
    <aside className="admin-sidebar" style={{ borderRight: "1px solid var(--border)", background: "var(--surface)" }}>
      <div className="admin-sidebar-inner">
        <div className="admin-brand">
          <strong>QUANTUM'27</strong>
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
        <Link className="exit" to="/root-os">
          <LogOut size={17} />
          Sign Out
        </Link>
      </div>
    </aside>
  );
}
