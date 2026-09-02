import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export function Footer() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.querySelectorAll(".reveal").forEach((r) =>
              r.classList.add("visible")
            );
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <footer className="footer" ref={ref}>
      <div className="footer-main">
        <div className="container footer-grid">
          <div className="reveal">
            <div className="footer-logo">
              <img src="/assets/kec-logo.png" alt="Kongu Engineering College" />
            </div>
            <h3>Quantum'27</h3>
            <p className="footer-dept">
              Department of Computer Technology – UG
              <br />
              Kongu Engineering College
            </p>
          </div>
          <div className="footer-links-col reveal reveal-delay-1">
            <h4>Quick Links</h4>
            <Link to="/schedule">Schedule</Link>
            <Link to="/events">Events</Link>
            <a href="mailto:kec.quantum@gmail.com?subject=Quantum'27 Feedback">
              Feedback
            </a>
          </div>
          <div className="footer-links-col reveal reveal-delay-2">
            <h4>Support</h4>
            <p style={{ fontSize: "14px", color: "var(--muted)", margin: "0 0 12px 0", lineHeight: "1.6" }}>
              Facing any error on the website or registration form? Contact for Registration Enquiry:
            </p>
            <a href="mailto:kec.quantum@gmail.com">kec.quantum@gmail.com</a>
            <a href="tel:+919443757559">9443757559</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          © 2026 Kongu Engineering College. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
