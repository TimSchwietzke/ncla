import { Children, cloneElement, isValidElement, type ReactNode } from "react";

/**
 * Worked input/output examples inside <Statement>.
 *
 * The label column has a fixed width on purpose: values line up across every example
 * on the page, so the eye travels down a straight line instead of hunting. That is the
 * whole difference between a block of text and something you can read at a glance.
 */

const LABEL = "w-16 shrink-0 font-mono text-2xs uppercase tracking-wide text-ink-faint";

export function Examples({ children }: { children: ReactNode }) {
  const items = Children.toArray(children).filter(isValidElement);
  return (
    <div className="my-4 space-y-2">
      {items.map((child, index) =>
        cloneElement(child as React.ReactElement<{ index?: number }>, { index: index + 1 }),
      )}
    </div>
  );
}

export function Example({
  input,
  output,
  index,
  children,
}: {
  input: string;
  output: string;
  /** Injected by <Examples>; authors never write it. */
  index?: number;
  children?: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface">
      {index ? (
        <p className="border-b border-line px-4 py-1.5 font-mono text-2xs uppercase tracking-wide text-ink-faint">
          Example {index}
        </p>
      ) : null}

      <dl className="space-y-1.5 px-4 py-3">
        <div className="flex gap-3">
          <dt className={LABEL}>Input</dt>
          <dd className="min-w-0 font-mono text-sm whitespace-pre-wrap text-ink">{input}</dd>
        </div>
        <div className="flex gap-3">
          <dt className={LABEL}>Output</dt>
          {/* The one coloured value in the block — scanning for the answer is what you do here. */}
          <dd className="min-w-0 font-mono text-sm whitespace-pre-wrap text-accent">{output}</dd>
        </div>
        {children ? (
          <div className="flex gap-3">
            <dt className={LABEL}>Why</dt>
            <dd className="min-w-0 text-sm text-ink-muted">{children}</dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}
