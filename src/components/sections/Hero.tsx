import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-overlay" />
      <div className="hero-decor-ring" aria-hidden="true" />
      <div className="container hero-content">
        <span className="hero-kicker">
          Department of Computer Technology – UG · Kongu Engineering College
        </span>
        <h1>
          QUANTUM<span>'27</span>
        </h1>
        <p className="hero-sub">An Intra Department Fest</p>
        <p className="hero-college">Kongu Engineering College, Perundurai</p>
        <div className="hero-date">24 September 2026</div>
        <div className="hero-actions">
          <Link className="btn btn-primary" to="/events">
            Explore Events{" "}
            <span className="btn-arrow">
              <ArrowRight size={16} />
            </span>
          </Link>
          <Link className="btn btn-ghost" to="/schedule">
            View Schedule
          </Link>
        </div>
      </div>
    </section>
  );
}
