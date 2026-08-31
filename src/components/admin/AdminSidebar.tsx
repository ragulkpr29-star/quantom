import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Trophy,
  Download,
  LogOut,
} from "lucide-react";

const items = [
  ["Dashboard", "/admin", LayoutDashboard],
  ["Registrations", "/admin/registrations", Users],
  ["Events", "/admin/events", Calendar],
  ["Evaluation", "/admin/evaluation", Trophy],
  ["Exports", "/admin/exports", Download],
] as const;

export function AdminSidebar() {
  const loc = useLocation();
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
        <Link className="exit" to="/">
          <LogOut size={17} />
          Exit Admin
        </Link>
      </div>
    </aside>
  );
}
