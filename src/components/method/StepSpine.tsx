import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { METHOD_STEPS } from "../../data/method";
import { setChecklist, useProblemProgress } from "../../lib/progress";

/**
 * The six method steps as a numbered spine: a continuous rule down the number column
 * says "sequence" without spelling it out.
 *
 * The steps are the checklist — there is no second list to tick off. `full` explains
 * each step, `compact` is the version M2 puts in the problem rail.
 *
 * Without a problemId the ticks are throwaway (the method page). With one they live in
 * the progress file, which already declares a `checklist` field — a second storage key
 * would be the same data in two places, drifting apart.
 */
export function StepSpine({
  variant = "full",
  problemId,
}: {
  variant?: "full" | "compact";
  problemId?: string;
}) {
  const persisted = useProblemProgress(problemId ?? "");
  const [ephemeral, setEphemeral] = useState<string[]>([]);
  const done = problemId ? persisted.checklist : ephemeral;

  function apply(next: string[]): void {
    if (problemId) setChecklist(problemId, next);
    else setEphemeral(next);
  }

  function toggle(id: string): void {
    apply(done.includes(id) ? done.filter((value) => value !== id) : [...done, id]);
  }

  const compact = variant === "compact";

  return (
    <div>
      <ol className="border-l border-line">
        {METHOD_STEPS.map((step) => {
          const checked = done.includes(step.id);
          return (
            <li key={step.id} className={compact ? "relative pl-4" : "relative pl-5 pb-6 last:pb-0"}>
              <span
                aria-hidden="true"
                className={`absolute -left-px block w-px bg-accent ${
                  checked ? "top-0 bottom-0" : "hidden"
                }`}
              />
              <button
                type="button"
                onClick={() => {
                  toggle(step.id);
                }}
                aria-pressed={checked}
                className="group flex w-full items-baseline gap-3 text-left"
              >
                <span
                  className={`shrink-0 font-mono text-2xs transition-colors ${
                    checked ? "text-accent" : "text-ink-faint"
                  }`}
                >
                  {step.id}
                </span>
                <span
                  className={`flex h-3.5 w-3.5 shrink-0 translate-y-0.5 items-center justify-center rounded-sm border transition-colors ${
                    checked
                      ? "border-accent bg-accent"
                      : "border-line-strong group-hover:border-ink-faint"
                  }`}
                >
                  {checked ? (
                    <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden="true">
                      <path
                        d="M1.5 5.2 L4 7.5 L8.5 2.5"
                        fill="none"
                        stroke="var(--ncla-bg)"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : null}
                </span>
                <span
                  className={`font-medium transition-colors ${
                    checked ? "text-ink-faint line-through decoration-line-strong" : "text-ink"
                  } ${compact ? "text-sm" : ""}`}
                >
                  {step.title}
                </span>
              </button>

              {compact ? null : (
                <div className="mt-1.5 ml-[3.1rem] max-w-[62ch]">
                  <p className="text-ink">{step.prompt}</p>
                  <p className="mt-1 text-sm text-ink-muted">{step.why}</p>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {done.length > 0 ? (
        <button
          type="button"
          onClick={() => {
            apply([]);
          }}
          className="mt-4 ml-5 flex items-center gap-1.5 font-mono text-2xs text-ink-faint transition-colors hover:text-ink"
        >
          <RotateCcw size={12} strokeWidth={1.75} />
          reset
        </button>
      ) : null}
    </div>
  );
}
