import { Link } from "react-router";
import { CATEGORIES } from "../data/categories";
import { PROBLEMS } from "../lib/content";
import { PageHeader, Rows } from "../components/ui/primitives";

export default function Categories() {
  return (
    <div className="max-w-[76ch]">
      <PageHeader
        title="Problems"
        lead="All 150 in the order of the NeetCode list. The five foundational categories come first."
      />

      <Rows>
        {CATEGORIES.map((category) => {
          const written = PROBLEMS.filter((p) => p.category === category.slug).length;
          return (
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
                  {category.foundational ? (
                    <span className="font-mono text-2xs text-accent">foundation</span>
                  ) : null}
                  <span className="w-12 text-right font-mono text-2xs text-ink-faint">
                    {written}/{category.count}
                  </span>
                </span>
                <span className="pl-11 text-sm text-ink-muted">{category.blurb}</span>
              </Link>
            </li>
          );
        })}
      </Rows>
    </div>
  );
}
