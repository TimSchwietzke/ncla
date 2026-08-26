import { Check, ChevronRight, Lock } from "lucide-react";
import { STAGES, STAGE_SHORT, useReveal } from "./RevealGate";

/** The state of the ladder at a glance — the view the landing page already promises. */
export function LadderStatus() {
  const { revealed, gated } = useReveal();
  if (!gated) return null;

  return (
    <ul className="space-y-1">
      {STAGES.map((stage, index) => {
        const open = index < revealed;
        const isNext = index === revealed;
        return (
          <li
            key={stage}
            className={`flex items-center gap-2 font-mono text-2xs ${
              open ? "text-ink-muted" : isNext ? "text-ink" : "text-ink-faint"
            }`}
          >
            {open ? (
              <Check size={12} strokeWidth={2} className="shrink-0 text-accent" />
            ) : isNext ? (
              <ChevronRight size={12} strokeWidth={2} className="shrink-0 text-accent" />
            ) : (
              <Lock size={11} strokeWidth={1.75} className="shrink-0" />
            )}
            {STAGE_SHORT[stage]}
          </li>
        );
      })}
    </ul>
  );
}
