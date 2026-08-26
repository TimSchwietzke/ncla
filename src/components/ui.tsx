import type { ReactNode } from "react";

export function PageHeader({ title, lead }: { title: string; lead?: string }) {
  return (
    <header className="mb-8">
      <h1 className="text-xl font-semibold tracking-tight text-balance">{title}</h1>
      {lead ? <p className="mt-2 max-w-[68ch] text-ink-muted">{lead}</p> : null}
    </header>
  );
}

/** A bordered region. Borders define structure here — shadows are for overlays only. */
export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-line bg-surface ${className}`}>{children}</div>
  );
}

/** Small uppercase mono label used above groups of content. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="font-mono text-2xs uppercase text-ink-faint">{children}</p>;
}

/** A list rendered as bordered rows rather than a grid of cards. */
export function Rows({ children }: { children: ReactNode }) {
  return (
    <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface">
      {children}
    </ul>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg border border-line bg-surface px-4 py-6 text-center text-sm text-ink-muted">
      {children}
    </p>
  );
}

/**
 * Marks a page that is deliberately still a placeholder. Quiet on purpose — a dashed
 * box shouts "unfinished" every time you open the app.
 */
export function MilestoneNote({ milestone, children }: { milestone: string; children: ReactNode }) {
  return (
    <div className="border-l-2 border-line-strong py-1 pl-4">
      <p className="font-mono text-2xs uppercase text-ink-faint">not built yet · {milestone}</p>
      <p className="mt-1 max-w-[68ch] text-sm text-ink-muted">{children}</p>
    </div>
  );
}
