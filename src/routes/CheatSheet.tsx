import type { ReactNode } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import {
  LAST_TEN_MINUTES,
  PYTHON_TRAPS,
  STRUCTURES,
  THRESHOLDS,
} from "../data/complexity";
import { PATTERNS } from "../data/patterns";
import { PageHeader } from "../components/ui/primitives";

function Section({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <section className="mb-10">
      <div className="mb-3 flex items-baseline justify-between gap-4 border-b border-line pb-2">
        <h2 className="font-mono text-2xs uppercase tracking-wider text-ink-faint">{label}</h2>
        {hint ? <span className="font-mono text-2xs text-ink-faint">{hint}</span> : null}
      </div>
      {children}
    </section>
  );
}

export default function CheatSheet() {
  return (
    <div className="max-w-[76ch]">
      <PageHeader
        title="Cheat sheet"
        lead="Everything that is worth looking up under time pressure, in the order you are likely to need it."
      />

      {/*
       * The source document closes with these three questions. In an app they belong at
       * the top: this page's most time-critical use is the ten minutes before an interview.
       */}
      <section className="mb-10 border-l-2 border-accent py-1 pl-5">
        <h2 className="font-mono text-2xs uppercase tracking-wider text-accent">
          The last ten minutes
        </h2>
        <ol className="mt-3 space-y-2">
          {LAST_TEN_MINUTES.map((question, index) => (
            <li key={question} className="flex gap-3">
              <span className="shrink-0 font-mono text-2xs text-ink-faint">{index + 1}</span>
              <span className="max-w-[62ch]">{question}</span>
            </li>
          ))}
        </ol>
      </section>

      <Section label="Constraints → what you may spend" hint="read n, read the column">
        <div className="overflow-x-auto">
          <div className="flex min-w-[34rem] gap-2">
            {THRESHOLDS.map((threshold) => (
              <div
                key={threshold.label}
                className="flex-1 rounded-md border border-line bg-surface px-2 py-2.5 text-center"
              >
                <p className="font-mono text-2xs text-ink-faint">{threshold.label}</p>
                <p className="mt-1 font-mono text-sm text-ink">{threshold.complexity}</p>
              </div>
            ))}
          </div>
          <div className="mt-1.5 flex min-w-[34rem] items-center gap-2 font-mono text-2xs text-ink-faint">
            <span className="h-px flex-1 bg-line" />
            <span>bigger n, less you may spend per element</span>
            <ArrowRight size={11} strokeWidth={1.75} />
          </div>
        </div>
      </Section>

      <Section label="Pattern triggers" hint={`${PATTERNS.length} patterns`}>
        <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface">
          {PATTERNS.map((pattern) => (
            <li key={pattern.slug}>
              <Link
                to={`/patterns/${pattern.slug}`}
                className="flex flex-col gap-1 px-4 py-2.5 transition-colors hover:bg-surface-2 sm:flex-row sm:items-baseline sm:gap-4"
              >
                <span className="flex-1 font-mono text-2xs text-ink-muted">{pattern.signal}</span>
                <span className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-ink">
                  {pattern.title}
                  <ArrowRight size={12} strokeWidth={1.75} className="text-ink-faint" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section label="Data structures">
        <div className="overflow-x-auto rounded-lg border border-line bg-surface">
          <table className="w-full min-w-[32rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="px-4 py-2 text-left font-mono text-2xs font-normal uppercase text-ink-faint">
                  Structure
                </th>
                {["access", "search", "insert", "delete"].map((column) => (
                  <th
                    key={column}
                    className="px-3 py-2 text-right font-mono text-2xs font-normal uppercase text-ink-faint"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STRUCTURES.map((row) => (
                <tr key={row.name} className="border-b border-line last:border-b-0">
                  <td className="px-4 py-2">{row.name}</td>
                  {[row.access, row.search, row.insert, row.remove].map((cell, index) => (
                    <td
                      key={index}
                      className="px-3 py-2 text-right font-mono text-2xs whitespace-nowrap text-ink-muted"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section label="Python traps" hint="the ones that bite in an interview">
        <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface">
          {PYTHON_TRAPS.map((trap) => (
            <li key={trap.code} className="flex flex-col gap-1 px-4 py-2.5 sm:flex-row sm:gap-4">
              <span className="w-[13rem] shrink-0 font-mono text-2xs text-accent">{trap.code}</span>
              <span className="text-sm text-ink-muted">{trap.what}</span>
            </li>
          ))}
        </ul>
      </Section>

      <p className="text-sm text-ink-muted">
        The procedure these tables serve is on the{" "}
        <Link to="/method" className="text-accent hover:underline">
          method page
        </Link>
        .
      </p>
    </div>
  );
}
