import type { ReactNode } from "react";
import type { ProblemMeta } from "../../data/types";
import { StepSpine } from "../method/StepSpine";
import { PatternChip } from "../ui/PatternChip";
import { LadderStatus } from "./LadderStatus";
import { ModeToggle } from "./ModeToggle";
import { Timer } from "./Timer";
import { ScheduleStatus } from "./ScheduleStatus";
import { isUnlocked, useReveal } from "./RevealGate";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-t border-line px-4 py-3 first:border-t-0">
      <p className="font-mono text-2xs uppercase text-ink-faint">{label}</p>
      <div className="mt-1.5 text-sm">{children}</div>
    </div>
  );
}

/**
 * Everything about a problem that is not the prose: how you are working, how long you
 * have been at it, the checklist, and what the interview would have told you anyway.
 * Sticky on wide screens so the target complexity stays in view while reading.
 */
export function MetaRail({ meta }: { meta: ProblemMeta }) {
  const { revealed, gated } = useReveal();
  const patternsVisible = isUnlocked("signals", revealed, gated);

  return (
    <div className="rounded-lg border border-line bg-surface">
      <div className="px-4 py-3">
        <ModeToggle />
      </div>

      {gated ? (
        <Field label="Attempt">
          <Timer problemId={meta.slug} />
        </Field>
      ) : null}

      <Field label="Schedule">
        <ScheduleStatus problemId={meta.slug} />
      </Field>

      <Field label="Target">
        <span className="font-mono text-ink">
          {meta.targetComplexity.time} time
          <br />
          {meta.targetComplexity.space} space
        </span>
      </Field>

      <Field label="Patterns">
        {patternsVisible ? (
          <div className="flex flex-wrap gap-1.5">
            {meta.patterns.map((slug) => (
              <PatternChip key={slug} slug={slug} />
            ))}
          </div>
        ) : (
          // The pattern name is half the solution, and it arrives with the signals.
          <p className="font-mono text-2xs text-ink-faint">revealed with the signals</p>
        )}
      </Field>

      {meta.prerequisites.length > 0 ? (
        <Field label="Assumes">
          <ul className="space-y-1 text-ink-muted">
            {meta.prerequisites.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Field>
      ) : null}

      {gated ? (
        <>
          <Field label="Checklist">
            <StepSpine variant="compact" problemId={meta.slug} />
          </Field>
          <Field label="Ladder">
            <LadderStatus />
          </Field>
        </>
      ) : null}

      <Field label="Source">
        <a
          href={meta.url}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-accent hover:underline"
        >
          LC {meta.leetcode} ↗
        </a>
        {meta.premium ? (
          <span className="ml-2 font-mono text-2xs text-ink-faint">premium</span>
        ) : null}
      </Field>
    </div>
  );
}
