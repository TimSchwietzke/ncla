import { Link, useParams } from "react-router";
import { getCategory } from "../data/categories";
import { problemsByCategory } from "../lib/content";
import { useMode } from "../lib/mode";
import { useProgress } from "../lib/progress";
import { DifficultyLabel } from "../components/ui/DifficultyLabel";
import { PatternChip } from "../components/ui/PatternChip";
import { EmptyState, PageHeader, Rows } from "../components/ui/primitives";
import { isUnlocked } from "../components/problem/RevealGate";
import NotFound from "./NotFound";

export default function Category() {
  const { categorySlug = "" } = useParams();
  const category = getCategory(categorySlug);
  const mode = useMode();
  const progress = useProgress();
  if (!category) return <NotFound />;

  const problems = problemsByCategory(category.slug);
  // The pattern name is half the solution (CLAUDE.md §7). The problem page hides it
  // until the signals are revealed; this list has to agree, or the list gives away
  // every problem in the category before you have opened one.
  const gated = mode === "learn";

  return (
    <div className="max-w-[76ch]">
      <PageHeader title={category.title} lead={category.blurb} />

      {problems.length === 0 ? (
        <EmptyState>
          None of the {category.count} problems in this category have been written up yet.
        </EmptyState>
      ) : (
        <Rows>
          {problems.map((problem) => (
            <li key={problem.slug}>
              <Link
                to={`/problems/${problem.category}/${problem.slug}`}
                className="flex flex-col gap-1 px-4 py-3 transition-colors hover:bg-surface-2"
              >
                <span className="flex items-baseline gap-3">
                  <span className="w-8 shrink-0 font-mono text-2xs text-ink-faint">
                    {problem.id}
                  </span>
                  <span className="flex-1 font-medium">{problem.title}</span>
                  {problem.status === "draft" ? (
                    <span className="font-mono text-2xs text-ink-faint">draft</span>
                  ) : null}
                  <DifficultyLabel difficulty={problem.difficulty} />
                </span>
                {isUnlocked(
                  "signals",
                  progress.problems[problem.slug]?.revealed ?? 0,
                  gated,
                ) ? (
                  <span className="flex flex-wrap gap-1.5 pl-11">
                    {problem.patterns.map((slug) => (
                      <PatternChip key={slug} slug={slug} linked={false} />
                    ))}
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </Rows>
      )}

      <p className="mt-4 font-mono text-2xs text-ink-faint">
        {problems.length} of {category.count} written up
      </p>
    </div>
  );
}
