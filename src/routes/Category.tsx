import { Link, useParams } from "react-router";
import { getCategory } from "../data/categories";
import { problemsByCategory } from "../lib/content";
import { DifficultyLabel } from "../components/DifficultyLabel";
import { PatternChip } from "../components/PatternChip";
import { EmptyState, PageHeader, Rows } from "../components/ui";
import NotFound from "./NotFound";

export default function Category() {
  const { categorySlug = "" } = useParams();
  const category = getCategory(categorySlug);
  if (!category) return <NotFound />;

  const problems = problemsByCategory(category.slug);

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
                <span className="flex flex-wrap gap-1.5 pl-11">
                  {problem.patterns.map((slug) => (
                    <PatternChip key={slug} slug={slug} linked={false} />
                  ))}
                </span>
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
