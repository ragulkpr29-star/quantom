import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import SchedulePage from "./pages/SchedulePage";
import RegistrationPage from "./pages/RegistrationPage";
import RegistrationSuccessPage from "./pages/RegistrationSuccessPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminRegistrationsPage from "./pages/AdminRegistrationsPage";
import AdminEventsPage from "./pages/AdminEventsPage";
import AdminEvaluationPage from "./pages/AdminEvaluationPage";
import AdminAuditLogPage from "./pages/AdminAuditLogPage";
import RootLoginPage from "./pages/RootLoginPage";
import RootDashboardPage from "./pages/RootDashboardPage";
import RootEvaluationPage from "./pages/RootEvaluationPage";
import RootResultsPage from "./pages/RootResultsPage";
import RootAuditLogPage from "./pages/RootAuditLogPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:slug" element={<EventDetailPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/register/:slug" element={<RegistrationPage />} />
        <Route path="/register/success" element={<RegistrationSuccessPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route
          path="/admin/registrations"
          element={<AdminRegistrationsPage />}
        />
        <Route path="/admin/events" element={<AdminEventsPage />} />
        <Route path="/admin/evaluation" element={<AdminEvaluationPage />} />
        <Route path="/admin/audit-log" element={<AdminAuditLogPage />} />
        
        {/* Root OS */}
        <Route path="/root-os" element={<RootLoginPage />} />
        <Route path="/root-os/dashboard" element={<RootDashboardPage />} />
        <Route path="/root-os/evaluation" element={<RootEvaluationPage />} />
        <Route path="/root-os/results" element={<RootResultsPage />} />
        <Route path="/root-os/audit-log" element={<RootAuditLogPage />} />
      </Routes>
    </BrowserRouter>
  );
}
