import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { METHOD_STEPS } from "../../data/method";

/**
 * The six method steps as a numbered spine: a continuous rule down the number column
 * says "sequence" without spelling it out.
 *
 * The steps are the checklist — there is no second list to tick off. `full` explains
 * each step, `compact` is the version M2 puts in the problem rail.
 *
 * Without a storageKey the ticks are throwaway (the method page); with one they are
 * remembered per problem.
 */
export function StepSpine({
  variant = "full",
  storageKey,
}: {
  variant?: "full" | "compact";
  storageKey?: string;
}) {
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    if (!storageKey) return;
    try {
      const raw = localStorage.getItem(storageKey);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) {
        setDone(parsed.filter((value): value is string => typeof value === "string"));
      }
    } catch {
      // A forgotten checklist is not worth an error.
    }
  }, [storageKey]);

  function toggle(id: string): void {
    setDone((current) => {
      const next = current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id];
      if (storageKey) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {
          // Ticking still works even when it cannot be remembered.
        }
      }
      return next;
    });
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
            setDone([]);
            if (storageKey) {
              try {
                localStorage.removeItem(storageKey);
              } catch {
                // Nothing to recover from.
              }
            }
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
