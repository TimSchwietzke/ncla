import { Link, useParams } from "react-router";
import { getCategory } from "../data/categories";
import { problemsByCategory } from "../lib/content";
import { DifficultyBadge, PageHeader } from "../components/ui";
import NotFound from "./NotFound";

export default function Category() {
  const { categorySlug = "" } = useParams();
  const category = getCategory(categorySlug);
  if (!category) return <NotFound />;

  const problems = problemsByCategory(category.slug);

  return (
    <>
      <PageHeader title={category.title} lead={category.blurb} />

      {problems.length === 0 ? (
        <p className="rounded-lg border border-dashed border-line bg-surface-2 p-5 text-sm text-muted">
          None of the {category.count} problems in this category have been written up yet.
        </p>
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface">
          {problems.map((problem) => (
            <li key={problem.slug}>
              <Link
                to={`/problems/${problem.category}/${problem.slug}`}
                className="flex items-baseline gap-3 px-4 py-3 transition-colors hover:bg-surface-2"
              >
                <span className="w-10 shrink-0 text-sm text-muted">{problem.id}</span>
                <span className="flex-1 font-medium">{problem.title}</span>
                {problem.status === "draft" ? (
                  <span className="text-xs uppercase tracking-wide text-muted">draft</span>
                ) : null}
                <DifficultyBadge difficulty={problem.difficulty} />
              </Link>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-6 text-sm text-muted">
        {problems.length} of {category.count} written up.
      </p>
    </>
  );
}
