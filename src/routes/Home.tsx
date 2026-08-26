import { Link } from "react-router";
import { CATEGORIES, TOTAL_PROBLEMS } from "../data/categories";
import { PATTERNS } from "../data/patterns";
import { PROBLEMS, problemsByPattern } from "../lib/content";
import { DifficultyLabel } from "../components/DifficultyLabel";
import { ProgressMosaic } from "../components/ProgressMosaic";
import { Rows } from "../components/ui";

function SectionHead({
  label,
  to,
  linkLabel,
}: {
  label: string;
  to?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-4 border-b border-line pb-2">
      <h2 className="font-mono text-2xs uppercase tracking-wider text-ink-faint">{label}</h2>
      {to && linkLabel ? (
        <Link to={to} className="font-mono text-2xs text-ink-faint hover:text-accent">
          {linkLabel} →
        </Link>
      ) : null}
    </div>
  );
}

export default function Home() {
  const written = PROBLEMS.length;
  const recent = PROBLEMS.slice(0, 3);

  return (
    <div className="max-w-[900px]">
      <header className="mb-12">
        <p className="font-mono text-2xs uppercase tracking-wider text-ink-faint">
          neetcode 150 · 18 patterns · 18 categories
        </p>
        <h1 className="mt-4 font-serif text-[2.5rem] leading-[1.1] tracking-tight text-balance sm:text-[3rem]">
          Prepare for the pattern, not for the problem.
        </h1>
        <p className="mt-5 max-w-[64ch] text-prose leading-relaxed text-ink-muted">
          Interviews do not test 150 solutions. They test about eighteen patterns, and the only
          skill that matters is recognising which one a strange problem is wearing. Work a problem,
          then reconstruct its one-sentence insight from memory three days later.
        </p>
      </header>

      <section className="mb-12">
        <SectionHead label="The whole list" to="/categories" linkLabel="all categories" />
        <ProgressMosaic />
        <p className="mt-4 font-mono text-2xs text-ink-faint">
          <span className="text-ink">{written}</span> written up ·{" "}
          {TOTAL_PROBLEMS - written} to go
        </p>
      </section>

      {recent.length > 0 ? (
        <section className="mb-12">
          <SectionHead label="Continue" />
          <Rows>
            {recent.map((problem) => (
              <li key={problem.slug}>
                <Link
                  to={`/problems/${problem.category}/${problem.slug}`}
                  className="flex items-baseline gap-3 px-4 py-2.5 transition-colors hover:bg-surface-2"
                >
                  <span className="w-8 shrink-0 font-mono text-2xs text-ink-faint">
                    {problem.id}
                  </span>
                  <span className="flex-1 truncate">{problem.title}</span>
                  <DifficultyLabel difficulty={problem.difficulty} />
                </Link>
              </li>
            ))}
          </Rows>
        </section>
      ) : null}

      <section className="mb-12">
        <SectionHead label="The eighteen patterns" to="/patterns" linkLabel="signals for each" />
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {PATTERNS.map((pattern) => (
            <li key={pattern.slug}>
              <Link
                to={`/patterns/${pattern.slug}`}
                className="flex h-full flex-col rounded-lg border border-line bg-surface px-3 py-2.5 transition-colors hover:border-accent"
              >
                <span className="font-medium">{pattern.title}</span>
                <span className="mt-auto pt-2 font-mono text-2xs text-ink-faint">
                  {pattern.slug} · {problemsByPattern(pattern.slug).length}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-12">
        <SectionHead label="Start with the foundation" />
        <p className="mb-3 max-w-[64ch] text-sm text-ink-muted">
          Categories 1–5 carry the techniques every later category reuses. After those the order is
          yours — leave Advanced Graphs and 2-D DP for last.
        </p>
        <Rows>
          {CATEGORIES.filter((category) => category.foundational).map((category) => {
            const done = PROBLEMS.filter((p) => p.category === category.slug).length;
            return (
              <li key={category.slug}>
                <Link
                  to={`/categories/${category.slug}`}
                  className="flex flex-col gap-1 px-4 py-3 transition-colors hover:bg-surface-2"
                >
                  <span className="flex items-baseline gap-3">
                    <span className="w-6 shrink-0 font-mono text-2xs text-ink-faint">
                      {category.number}
                    </span>
                    <span className="flex-1 font-medium">{category.title}</span>
                    <span className="font-mono text-2xs text-ink-faint">
                      {done}/{category.count}
                    </span>
                  </span>
                  <span className="pl-9 text-sm text-ink-muted">{category.blurb}</span>
                </Link>
              </li>
            );
          })}
        </Rows>
      </section>

      <section>
        <SectionHead label="Never seen this problem before?" />
        <div className="border-l-2 border-accent py-1 pl-5">
          <p className="max-w-[62ch] font-serif text-lg leading-snug">
            Read the examples, derive the target complexity from the constraints, name the brute
            force, find its bottleneck — only then pick a pattern.
          </p>
          <Link to="/method" className="mt-3 inline-block text-sm text-accent hover:underline">
            Read the method →
          </Link>
        </div>
      </section>
    </div>
  );
}
