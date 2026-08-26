import { Link } from "react-router";
import { CATEGORIES, TOTAL_PROBLEMS } from "../data/categories";
import { PROBLEMS } from "../lib/content";
import { DifficultyLabel } from "../components/DifficultyLabel";
import { Eyebrow, PageHeader, Rows } from "../components/ui";

export default function Home() {
  const written = PROBLEMS.length;
  const recent = PROBLEMS.slice(0, 3);

  return (
    <div className="max-w-[76ch]">
      <PageHeader
        title="Prepare for the pattern, not for the problem"
        lead="Interviews do not test 150 solutions, they test about 18 patterns. Work through a problem, then be able to reconstruct its one-sentence insight from memory three days later."
      />

      <section className="mb-10">
        <div className="flex items-baseline justify-between">
          <Eyebrow>Progress</Eyebrow>
          <span className="font-mono text-2xs text-ink-faint">
            {written} / {TOTAL_PROBLEMS}
          </span>
        </div>
        <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-line">
          <div
            className="h-full bg-accent"
            style={{ width: `${Math.max((written / TOTAL_PROBLEMS) * 100, 1)}%` }}
          />
        </div>
      </section>

      {recent.length > 0 ? (
        <section className="mb-10">
          <Eyebrow>Continue</Eyebrow>
          <div className="mt-2">
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
          </div>
        </section>
      ) : null}

      <section className="mb-10">
        <Eyebrow>Start with the foundation</Eyebrow>
        <p className="mt-2 mb-3 text-sm text-ink-muted">
          Categories 1–5 carry the techniques every later category reuses. After those the order is
          yours — leave Advanced Graphs and 2-D DP for last.
        </p>
        <Rows>
          {CATEGORIES.filter((category) => category.foundational).map((category) => (
            <li key={category.slug}>
              <Link
                to={`/categories/${category.slug}`}
                className="flex flex-col gap-0.5 px-4 py-3 transition-colors hover:bg-surface-2"
              >
                <span className="flex items-baseline gap-3">
                  <span className="w-8 shrink-0 font-mono text-2xs text-ink-faint">
                    {category.number}
                  </span>
                  <span className="flex-1 font-medium">{category.title}</span>
                  <span className="font-mono text-2xs text-ink-faint">
                    {PROBLEMS.filter((p) => p.category === category.slug).length}/{category.count}
                  </span>
                </span>
                <span className="pl-11 text-sm text-ink-muted">{category.blurb}</span>
              </Link>
            </li>
          ))}
        </Rows>
      </section>

      <section>
        <Eyebrow>Never seen this problem before?</Eyebrow>
        <p className="mt-2 text-sm text-ink-muted">
          There is a repeatable way in: read the examples, derive the target complexity from the
          constraints, name the brute force, find its bottleneck, and only then pick a pattern.
        </p>
        <Link to="/method" className="mt-2 inline-block text-sm text-accent hover:underline">
          Read the method →
        </Link>
      </section>
    </div>
  );
}
