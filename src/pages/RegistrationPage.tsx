import { useParams, Navigate, Link } from "react-router-dom";
import { Navbar } from "../components/sections/Navbar";
import { Footer } from "../components/sections/Footer";
import { eventService } from "../services";
import { RegistrationForm } from "../components/forms/RegistrationForm";
import { ArrowLeft } from "lucide-react";

export default function RegistrationPage() {
  const { slug } = useParams();
  const e = eventService.getById(slug || "");
  if (!e) return <Navigate to="/events" replace />;

  return (
    <>
      <Navbar />
      <main>
        {/* Page header */}
        <header className="reg-page-header">
          <div className="container narrow">
            <span className="eyebrow">Event {e.number}</span>
            <h1>{e.name}</h1>
            <p>Registration closes on <strong style={{ color: "var(--green-light)" }}>21 September 2026</strong>.</p>
          </div>
        </header>

        {/* Form body */}
        <div className="reg-page-body">
          <div className="container narrow">
            <Link className="back-link" to={`/events/${e.id}`}>
              <ArrowLeft size={14} /> Back to event details
            </Link>
            <RegistrationForm event={e} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
