import type { ReactNode } from "react";

/**
 * The constraints of a problem, in their own frame rather than buried in a sentence.
 *
 * Reading them is step 2 of the method and the thing the target complexity is derived
 * from, so they have to be legible in a second. Styling for the list lives in
 * index.css next to .prose-ncla, which it has to override.
 */
export function Constraints({ children }: { children: ReactNode }) {
  return (
    <div className="my-4 overflow-hidden rounded-lg border border-line bg-surface">
      <p className="border-b border-line px-4 py-1.5 font-mono text-2xs uppercase tracking-wide text-ink-faint">
        Constraints
      </p>
      <div className="constraint-list px-4 py-3">{children}</div>
    </div>
  );
}
