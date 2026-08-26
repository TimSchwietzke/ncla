import type { ReactNode } from "react";
import { getPattern } from "../../data/patterns";
import { CodeBlock, SolutionContext } from "../CodeBlock";

/**
 * The fixed section components every problem MDX file is built from (CLAUDE.md §6).
 * They render and label content; the staged reveal that hides them one by one is M2.
 */

function Section({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-9">
      <h2 className="mb-3 font-mono text-2xs uppercase text-ink-faint">
        {label}
        {hint ? <span className="ml-2 normal-case">— {hint}</span> : null}
      </h2>
      <div className="prose-ncla">{children}</div>
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

/**
 * The one sentence to be able to reconstruct from memory. It is the only place in the
 * app that uses the serif — a single signature, so it stays a signature.
 */
export function Insight({ children }: { children: ReactNode }) {
  return (
    <section className="mb-9 border-l-2 border-accent py-1 pl-5">
      <h2 className="mb-2 font-mono text-2xs uppercase text-accent">Insight</h2>
      {/* A div, not a p — MDX already wraps the sentence in its own paragraph. */}
      <div className="max-w-[62ch] font-serif text-lg leading-snug text-ink">{children}</div>
    </section>
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
  return (
    <SolutionContext.Provider value={variant}>
      <Section label={variant === "brute" ? "Solution · brute force" : "Solution · optimal"}>
        {children}
      </Section>
    </SolutionContext.Provider>
  );
}

export function Pitfalls({ children }: { children: ReactNode }) {
  return <Section label="Pitfalls">{children}</Section>;
}

export function FollowUps({ children }: { children: ReactNode }) {
  return <Section label="Follow-ups">{children}</Section>;
}

/** A pattern visualizer, seeded with this problem's own example. Placeholder until M3. */
export function Viz({ name, preset }: { name: string; preset?: string }) {
  const pattern = getPattern(name);
  return (
    <div className="my-5 rounded-lg border border-line bg-surface-2 px-4 py-3">
      <p className="font-mono text-2xs uppercase text-ink-faint">
        visualizer · {preset ? `${name} / ${preset}` : name}
      </p>
      <p className="mt-1 text-sm text-ink-muted">
        {pattern?.title ?? name} — step-by-step player arrives in milestone M3.
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
  pre: CodeBlock,
};
