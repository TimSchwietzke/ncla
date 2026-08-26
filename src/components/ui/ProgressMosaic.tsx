import { Link } from "react-router";
import { CATEGORIES } from "../../data/categories";
import { PROBLEMS } from "../../lib/content";
import { useProgress } from "../../lib/progress";
import { maturity } from "../../lib/srs";

/**
 * All 150 problems as one strip: eighteen clusters, one cell per problem, filled
 * once the problem is written up. It is the whole scope of the list at a glance —
 * and it stays honest, because every cell is a real position in the source document.
 */
export function ProgressMosaic({ colorBy = "written" }: { colorBy?: "written" | "mastery" }) {
  const file = useProgress();

  return (
    <div className="flex flex-wrap gap-x-3 gap-y-2.5">
      {CATEGORIES.map((category) => {
        const inCategory = PROBLEMS.filter((problem) => problem.category === category.slug);
        const bySlot = new Map(inCategory.map((p) => [Number(p.id.split(".")[1]), p]));

        // "written" asks whether the write-up exists; "mastery" asks how well it sticks.
        const cellClass = (slot: number): string => {
          const problem = bySlot.get(slot);
          if (!problem) return "bg-line group-hover:bg-line-strong";
          if (colorBy === "written") return "bg-accent";
          const progress = file.problems[problem.slug];
          const state = maturity(progress?.intervalDays);
          if (state === "mature") return "bg-accent";
          if (state === "learning") return "bg-accent opacity-45";
          return "bg-line-strong";
        };

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
                  className={`h-[18px] w-[7px] rounded-[1px] transition-colors ${cellClass(index + 1)}`}
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
