import { Link } from "react-router";
import { CATEGORIES } from "../../data/categories";
import { PROBLEMS } from "../../lib/content";

/**
 * All 150 problems as one strip: eighteen clusters, one cell per problem, filled
 * once the problem is written up. It is the whole scope of the list at a glance —
 * and it stays honest, because every cell is a real position in the source document.
 */
export function ProgressMosaic() {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-2.5">
      {CATEGORIES.map((category) => {
        const inCategory = PROBLEMS.filter((problem) => problem.category === category.slug);
        const positions = new Set(inCategory.map((problem) => Number(problem.id.split(".")[1])));

        return (
          <Link
            key={category.slug}
            to={`/categories/${category.slug}`}
            title={`${category.number}. ${category.title} — ${inCategory.length} of ${category.count} written up`}
            aria-label={`${category.title}, ${inCategory.length} of ${category.count} written up`}
            className="group flex flex-col gap-1"
          >
            <span className="flex gap-[2px]">
              {Array.from({ length: category.count }, (_, index) => (
                <span
                  key={index}
                  className={`h-[18px] w-[7px] rounded-[1px] transition-colors ${
                    positions.has(index + 1)
                      ? "bg-accent"
                      : "bg-line group-hover:bg-line-strong"
                  }`}
                />
              ))}
            </span>
            <span className="font-mono text-2xs text-ink-faint transition-colors group-hover:text-ink">
              {category.number}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
