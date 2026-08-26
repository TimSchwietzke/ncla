import type { ReactNode } from "react";
import { getPattern } from "../../data/patterns";
import { CodeBlock, SolutionContext } from "./CodeBlock";
import { Example, Examples } from "./Example";
import { Constraints } from "./Constraints";
import { Gate, useReveal } from "./RevealGate";

/**
 * The fixed section components every problem MDX file is built from (CLAUDE.md §6).
 *
 * Everything past <Statement> sits behind its rung of the ladder. The stage mapping
 * lives here and nowhere else, so adding a section means touching one file.
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
    <Gate stage="signals">
      <Section label="Signals" hint="what gives the pattern away">
        {children}
      </Section>
    </Gate>
  );
}

export function BruteForce({ children }: { children: ReactNode }) {
  return (
    <Gate stage="bruteForce">
      <Section label="Brute force" hint="say this out loud first, then beat it">
        {children}
      </Section>
    </Gate>
  );
}

/**
 * The one sentence to be able to reconstruct from memory. It is the only place in the
 * app that uses the serif — a single signature, so it stays a signature.
 */
export function Insight({ children }: { children: ReactNode }) {
  return (
    <Gate stage="insight">
      <section className="mb-9 border-l-2 border-accent py-1 pl-5">
        <h2 className="mb-2 font-mono text-2xs uppercase text-accent">Insight</h2>
        {/* A div, not a p — MDX already wraps the sentence in its own paragraph. */}
        <div className="max-w-[62ch] font-serif text-lg leading-snug text-ink">{children}</div>
      </section>
    </Gate>
  );
}

export function Approach({ children }: { children: ReactNode }) {
  return (
    <Gate stage="approach">
      <Section label="Approach">{children}</Section>
    </Gate>
  );
}

/**
 * In learn mode the code is already behind the ladder, so revealing it shows it open —
 * you asked for it. In reference mode everything is open by default, and the solution
 * is the one thing that still needs a deliberate click (CLAUDE.md §7).
 */
export function Solution({
  children,
  variant = "optimal",
}: {
  children: ReactNode;
  variant?: "brute" | "optimal";
}) {
  const { gated } = useReveal();
  const label = variant === "brute" ? "Solution · brute force" : "Solution · optimal";

  return (
    <Gate stage="solution">
      <SolutionContext.Provider value={variant}>
        {gated ? (
          <Section label={label}>{children}</Section>
        ) : (
          <details className="mb-9 overflow-hidden rounded-lg border border-line bg-surface">
            <summary className="cursor-pointer list-none px-4 py-2.5 font-mono text-2xs uppercase text-ink-faint transition-colors hover:text-ink">
              {label} — click to open
            </summary>
            <div className="prose-ncla border-t border-line px-4 py-3">{children}</div>
          </details>
        )}
      </SolutionContext.Provider>
    </Gate>
  );
}

export function Pitfalls({ children }: { children: ReactNode }) {
  return (
    <Gate stage="wrapUp">
      <Section label="Pitfalls">{children}</Section>
    </Gate>
  );
}

export function FollowUps({ children }: { children: ReactNode }) {
  return (
    <Gate stage="wrapUp">
      <Section label="Follow-ups">{children}</Section>
    </Gate>
  );
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
  Examples,
  Example,
  Constraints,
  pre: CodeBlock,
};
