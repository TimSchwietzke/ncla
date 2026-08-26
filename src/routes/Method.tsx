import type { ReactNode } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { PRACTICE_LOOP } from "../data/method";
import { StepSpine } from "../components/method/StepSpine";
import { WorkedExample } from "../components/method/WorkedExample";
import { PageHeader } from "../components/ui/primitives";

function Section({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <section className="mb-12">
      <div className="mb-4 flex items-baseline justify-between gap-4 border-b border-line pb-2">
        <h2 className="font-mono text-2xs uppercase tracking-wider text-ink-faint">{label}</h2>
        {hint ? <span className="font-mono text-2xs text-ink-faint">{hint}</span> : null}
      </div>
      {children}
    </section>
  );
}

export default function Method() {
  return (
    <div className="max-w-[76ch]">
      <PageHeader
        title="How to attack a problem you have never seen"
        lead="An interview never gives you a problem you have practised. What carries over is not a solution but an order of operations — this one."
      />

      <Section label="The loop" hint="how each problem is worked">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {PRACTICE_LOOP.map((stage) => (
            <div key={stage.label} className="rounded-lg border border-line bg-surface px-3 py-3">
              <p className="font-mono text-xl text-ink">{stage.value}</p>
              <p className="mt-0.5 font-mono text-2xs uppercase tracking-wide text-ink-faint">
                {stage.label}
              </p>
              <p className="mt-2 text-sm text-ink-muted">{stage.detail}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* The steps carry their own checkboxes — a second list to tick off would be redundant. */}
      <Section label="The sequence" hint="tick them off as you go">
        <StepSpine />
      </Section>

      <Section label="Worked example — Two Sum" hint="the same six steps, answered">
        <WorkedExample />
      </Section>

      <div className="flex flex-wrap gap-x-8 gap-y-2 border-t border-line pt-6 text-sm">
        <Link to="/cheat-sheet" className="flex items-center gap-1.5 text-accent hover:underline">
          The tables for steps 2 and 3
          <ArrowRight size={14} strokeWidth={2} />
        </Link>
        <Link to="/categories" className="flex items-center gap-1.5 text-accent hover:underline">
          Start with the foundation
          <ArrowRight size={14} strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
}
