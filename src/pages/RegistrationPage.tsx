import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Navbar } from "../components/sections/Navbar";
import { Footer } from "../components/sections/Footer";
import { eventService, googleSheetsService } from "../services";
import { RegistrationForm } from "../components/forms/RegistrationForm";
import { ArrowLeft, AlertCircle, Clock } from "lucide-react";
import type { EventConfig } from "../types";

const EVENT_SLUG_TO_ID: Record<string, string> = {
  "paper-presentation": "PP",
  "project-presentation": "PR",
  "vox-pop-debate": "VO",
  "debate": "VO",
  "web-designing": "WE",
  "culturals": "SH",
  "ipl-auction": "IP"
};

const REGISTRATION_MAINTENANCE = false;

export default function RegistrationPage() {
  if (REGISTRATION_MAINTENANCE) {
    return (
      <>
        <Navbar />
        <main style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px", textAlign: "center", padding: "20px" }}>
          <Clock size={48} style={{ color: "var(--green)" }} />
          <h2>Registration Page Under Maintenance</h2>
          <p style={{ fontSize: "1.1rem", maxWidth: "600px", color: "var(--muted)" }}>
            Registration will open on Sunday at 6:00 PM.<br />
            Please come back then to register for the events.<br />
            <br />
            Thank you for your patience!
          </p>
          <Link to="/events" className="btn btn-outline" style={{ marginTop: "10px" }}>Back to Events</Link>
        </main>
        <Footer />
      </>
    );
  }

  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [e, setE] = useState<EventConfig | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadEvent = async () => {
      setLoading(true);
      setError("");

      const backendEventId = EVENT_SLUG_TO_ID[slug || ""] || slug;

      if (!backendEventId) {
        if (isMounted) {
          setError("Event configuration not found");
          setLoading(false);
        }
        return;
      }

      try {
        const backendEvents = await googleSheetsService.getEvents();
        const backendEvent = backendEvents.find(
          (x: any) => x.id === backendEventId || x.eventId === backendEventId
        );

        if (!backendEvent) {
          if (isMounted) setError("Event configuration not found");
          return;
        }

        // We get the local config for UI text (rules, etc)
        const localConfig = eventService.getById(backendEventId);

        // Ensure criteria is also retrieved from backend
        try {
          await googleSheetsService.getCriteria(backendEventId);
        } catch (e) {
          console.warn("Criteria fetch failed (possibly unauthorized)", e);
        }

        if (isMounted) {
          // We pass the backend ID to the form to override the local config ID
          setE(localConfig ? {
            ...localConfig,
            id: backendEventId
          } : {
            id: backendEventId,
            name: backendEvent.eventName || backendEvent.name,
            number: "00",
            category: "General",
            description: "Event registration",
            participationType: "team", // Default assumption
            minMembers: 1,
            maxMembers: 4,
            eligibility: "Open",
            rules: [],
            instructions: [],
            evaluationCriteria: [],
            registrationOpen: true
          } as EventConfig);
        }
      } catch (err) {
        if (isMounted) setError("Event configuration not found");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadEvent();

    return () => { isMounted = false; };
  }, [slug]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="spinner" style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--green)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !e) {
    return (
      <>
        <Navbar />
        <main style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
          <AlertCircle size={48} style={{ color: "var(--red)" }} />
          <h2>{error || "Event configuration not found"}</h2>
          <Link to="/events" className="btn btn-outline">Back to Events</Link>
        </main>
        <Footer />
      </>
    );
  }

  // Determine actual local slug for the back link
  const backSlug = e.id;

  return (
    <>
      <Navbar />
      <main>
        <header className="reg-page-header">
          <div className="container narrow">
            <span className="eyebrow">Event {e.number}</span>
            <h1>{e.name}</h1>
            <p>Registration closes on <strong style={{ color: "var(--green-light)" }}>21 September 2026</strong>.</p>
          </div>
        </header>

        <div className="reg-page-body">
          <div className="container narrow">
            <Link className="back-link" to={`/events/${backSlug}`}>
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
