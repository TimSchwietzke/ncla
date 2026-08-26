import { Eye } from "lucide-react";
import { STAGES, STAGE_LABELS, useReveal } from "./RevealGate";

/**
 * Sits directly under the last revealed section, because that is where your eyes are
 * when you get stuck. It always names what comes next, so the decision to spend a hint
 * is made knowingly rather than by clicking a blank button.
 */
export function RevealControl({ onReveal }: { onReveal: () => void }) {
  const { revealed, gated } = useReveal();
  if (!gated) return null;

  const next = STAGES[revealed];

  if (!next) {
    return (
      <p className="mb-9 border-t border-line pt-4 font-mono text-2xs text-ink-faint">
        Everything is open. Switch to reference mode next time you revisit this one.
      </p>
    );
  }

  return (
    <div className="mb-9 rounded-lg border border-dashed border-line-strong bg-surface px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-muted">
          Stuck? Next up is <span className="text-ink">{STAGE_LABELS[next]}</span>.
        </p>
        <button
          type="button"
          onClick={onReveal}
          className="flex items-center gap-1.5 rounded-md border border-accent bg-accent-soft px-3 py-1.5 font-mono text-2xs text-accent transition-colors hover:bg-accent hover:text-bg"
        >
          <Eye size={13} strokeWidth={1.75} />
          reveal
        </button>
      </div>
      <p className="mt-2 font-mono text-2xs text-ink-faint">
        {revealed} of {STAGES.length} revealed
      </p>
    </div>
  );
}
