import { useEffect, useRef } from "react";

export function useScrollReveal() {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12 }
    );
    // Observe the element itself and all .reveal children
    const reveals = el.querySelectorAll<HTMLElement>(".reveal");
    reveals.forEach((r) => observer.observe(r));
    if (el.classList.contains("reveal")) observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}
