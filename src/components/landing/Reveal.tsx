import { useEffect, useRef, useState, type ReactNode } from "react";

/** If the observer never reports, show the content anyway rather than leave a blank page. */
const SAFETY_MS = 2500;

/**
 * Fades a section in when it scrolls into view.
 *
 * Three ways to become visible, in order: the system asked for reduced motion, the
 * element is already on screen at mount, or the observer reports it. A timer backs all
 * of them up — a decorative animation must never be able to hide the actual content.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    const element = ref.current;
    if (!element) {
      setShown(true);
      return;
    }

    if (element.getBoundingClientRect().top < window.innerHeight) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setShown(true);
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    observer.observe(element);

    const safety = window.setTimeout(() => {
      setShown(true);
    }, SAFETY_MS);

    return () => {
      observer.disconnect();
      window.clearTimeout(safety);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
      className={`transition-all duration-700 ease-out ${
        shown ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}
