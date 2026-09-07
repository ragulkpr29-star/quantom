import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/admin-login" || location.pathname === "/root-os") {
      setIsAuthenticated(false);
      return;
    }
    fetch("/api/verify")
      .then((res) => res.json())
      .then((data) => {
        setIsAuthenticated(data.authenticated === true);
      })
      .catch(() => setIsAuthenticated(false));
  }, [location.pathname]);

  if (isAuthenticated === null) {
    return (
      <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg)" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>Authenticating...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    const isRootOs = location.pathname.startsWith("/root-os");
    return <Navigate to={isRootOs ? "/root-os" : "/admin-login"} replace />;
  }

  return <>{children}</>;
}
