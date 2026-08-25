import type { ReactNode } from "react";
import { getPattern } from "../../data/patterns";

/**
 * The fixed section components every problem MDX file is built from (CLAUDE.md §6).
 * They only render and label content here; the staged reveal that hides them one by one
 * is milestone M2.
 */

function Section({
  label,
  hint,
  children,
  tone = "default",
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  tone?: "default" | "accent";
}) {
  const border = tone === "accent" ? "border-accent" : "border-line";
  return (
    <section className={`mb-6 rounded-lg border-l-4 ${border} bg-surface px-5 py-4`}>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">
        {label}
        {hint ? <span className="ml-2 font-normal normal-case tracking-normal">{hint}</span> : null}
      </h2>
      <div className="prose-ncla mt-3 space-y-3 leading-relaxed">{children}</div>
    </section>
  );
}

export function Statement({ children }: { children: ReactNode }) {
  return <Section label="Problem">{children}</Section>;
}

export function Signals({ children }: { children: ReactNode }) {
  return (
    <Section label="Signals" hint="what gives the pattern away">
      {children}
    </Section>
  );
}

export function BruteForce({ children }: { children: ReactNode }) {
  return (
    <Section label="Brute force" hint="say this out loud first, then beat it">
      {children}
    </Section>
  );
}

export function Insight({ children }: { children: ReactNode }) {
  return (
    <Section label="Insight" tone="accent">
      <p className="text-lg font-medium">{children}</p>
    </Section>
  );
}

export function Approach({ children }: { children: ReactNode }) {
  return <Section label="Approach">{children}</Section>;
}

export function Solution({
  children,
  variant = "optimal",
}: {
  children: ReactNode;
  variant?: "brute" | "optimal";
}) {
  const label = variant === "brute" ? "Solution — brute force" : "Solution — optimal";
  return <Section label={label}>{children}</Section>;
}

export function Pitfalls({ children }: { children: ReactNode }) {
  return <Section label="Pitfalls">{children}</Section>;
}

export function FollowUps({ children }: { children: ReactNode }) {
  return <Section label="Follow-ups">{children}</Section>;
}

/**
 * Embeds a pattern visualizer, optionally seeded with this problem's own example.
 * Renders a labelled placeholder until the visualizers land in M3.
 */
export function Viz({ name, preset }: { name: string; preset?: string }) {
  const pattern = getPattern(name);
  return (
    <div className="my-4 rounded-lg border border-dashed border-line bg-surface-2 p-5 text-sm">
      <p className="font-semibold">Visualizer: {pattern?.title ?? name}</p>
      <p className="mt-1 text-muted">
        {preset ? `Preset "${preset}". ` : ""}
        Step-by-step player arrives in milestone M3.
      </p>
    </div>
  );
}

/** Passed to MDXProvider so problem files can use these tags directly. */
export const MDX_COMPONENTS = {
  Statement,
  Signals,
  BruteForce,
  Insight,
  Approach,
  Solution,
  Pitfalls,
  FollowUps,
  Viz,
};
