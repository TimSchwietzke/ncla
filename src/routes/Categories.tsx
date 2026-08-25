import { Link } from "react-router";
import { CATEGORIES } from "../data/categories";
import { PROBLEMS } from "../lib/content";
import { PageHeader } from "../components/ui";

export default function Categories() {
  return (
    <>
      <PageHeader
        title="Problems"
        lead="All 150 in the order of the NeetCode list. The five foundational categories come first."
      />

      <ul className="grid gap-3 sm:grid-cols-2">
        {CATEGORIES.map((category) => {
          const written = PROBLEMS.filter((p) => p.category === category.slug).length;
          return (
            <li key={category.slug}>
              <Link
                to={`/categories/${category.slug}`}
                className="flex h-full flex-col rounded-lg border border-line bg-surface p-4 transition-colors hover:border-accent"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-medium">
                    <span className="mr-2 text-muted">{category.number}</span>
                    {category.title}
                  </span>
                  <span className="shrink-0 text-sm text-muted">
                    {written}/{category.count}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted">{category.blurb}</p>
                {category.foundational ? (
                  <span className="mt-2 text-xs font-semibold uppercase tracking-wide text-accent">
                    Foundation
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
