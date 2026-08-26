import type { ReactNode } from "react";
import type { ProblemMeta } from "../data/types";
import { PatternChip } from "./PatternChip";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-t border-line px-4 py-3 first:border-t-0">
      <p className="font-mono text-2xs uppercase text-ink-faint">{label}</p>
      <div className="mt-1.5 text-sm">{children}</div>
    </div>
  );
}

/**
 * Everything about a problem that is not the prose. Sticky on wide screens so the
 * target complexity stays in view while reading. The timer and the reveal controls
 * from M2 belong here too.
 */
export function MetaRail({ meta }: { meta: ProblemMeta }) {
  return (
    <div className="rounded-lg border border-line bg-surface">
      <Field label="Target">
        <span className="font-mono text-ink">
          {meta.targetComplexity.time} time
          <br />
          {meta.targetComplexity.space} space
        </span>
      </Field>

      <Field label="Patterns">
        <div className="flex flex-wrap gap-1.5">
          {meta.patterns.map((slug) => (
            <PatternChip key={slug} slug={slug} />
          ))}
        </div>
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
