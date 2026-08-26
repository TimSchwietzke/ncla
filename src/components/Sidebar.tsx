import { useMemo, useState } from "react";
import { NavLink, useParams } from "react-router";
import { CATEGORIES, TOTAL_PROBLEMS } from "../data/categories";
import { PROBLEMS } from "../lib/content";
import { ThemeToggle } from "./ThemeToggle";
import { DifficultyLabel } from "./DifficultyLabel";

const SECTIONS = [
  { to: "/method", label: "Method" },
  { to: "/patterns", label: "Patterns" },
  { to: "/review", label: "Review" },
  { to: "/progress", label: "Progress" },
  { to: "/cheat-sheet", label: "Cheat sheet" },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const [filter, setFilter] = useState("");
  const { categorySlug } = useParams();
  const query = filter.trim().toLowerCase();

  const written = PROBLEMS.length;
  const matches = useMemo(
    () =>
      query === ""
        ? []
        : PROBLEMS.filter(
            (p) => p.title.toLowerCase().includes(query) || p.id.startsWith(query),
          ),
    [query],
  );

  const visibleCategories = useMemo(
    () => (query === "" ? CATEGORIES : CATEGORIES.filter((c) => c.title.toLowerCase().includes(query))),
    [query],
  );

  return (
    <div className="flex h-full flex-col border-r border-line bg-surface-2">
      <div className="border-b border-line px-4 py-4">
        <NavLink to="/" onClick={onNavigate} className="block">
          <span className="text-lg font-semibold tracking-tight">NCLA</span>
          <span className="ml-2 font-mono text-2xs text-ink-faint">neetcode 150</span>
        </NavLink>

        <div className="mt-3">
          <div className="h-[3px] w-full overflow-hidden rounded-full bg-line">
            <div
              className="h-full bg-accent"
              style={{ width: `${Math.max((written / TOTAL_PROBLEMS) * 100, 1)}%` }}
            />
          </div>
          <p className="mt-1.5 font-mono text-2xs text-ink-faint">
            {written} / {TOTAL_PROBLEMS} written up
          </p>
        </div>
      </div>

      <div className="border-b border-line px-3 py-3">
        <input
          type="search"
          value={filter}
          onChange={(event) => {
            setFilter(event.target.value);
          }}
          placeholder="Filter problems"
          aria-label="Filter problems"
          className="w-full rounded-md border border-line bg-surface px-2.5 py-1.5 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
        />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {query === "" ? (
          <ul className="mb-4 space-y-0.5">
            {SECTIONS.map((section) => (
              <li key={section.to}>
                <NavLink
                  to={section.to}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `block rounded-md px-2.5 py-1.5 text-sm transition-colors ${
                      isActive
                        ? "bg-accent-soft font-medium text-accent"
                        : "text-ink-muted hover:bg-surface hover:text-ink"
                    }`
                  }
                >
                  {section.label}
                </NavLink>
              </li>
            ))}
          </ul>
        ) : null}

        {matches.length > 0 ? (
          <>
            <p className="px-2.5 pb-1.5 font-mono text-2xs uppercase text-ink-faint">
              {matches.length} match{matches.length === 1 ? "" : "es"}
            </p>
            <ul className="mb-4 space-y-0.5">
              {matches.map((problem) => (
                <li key={problem.slug}>
                  <NavLink
                    to={`/problems/${problem.category}/${problem.slug}`}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `flex items-baseline gap-2 rounded-md px-2.5 py-1.5 text-sm transition-colors ${
                        isActive
                          ? "bg-accent-soft font-medium text-accent"
                          : "text-ink-muted hover:bg-surface hover:text-ink"
                      }`
                    }
                  >
                    <span className="font-mono text-2xs text-ink-faint">{problem.id}</span>
                    <span className="truncate">{problem.title}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </>
        ) : null}

        <p className="px-2.5 pb-1.5 font-mono text-2xs uppercase text-ink-faint">Problems</p>
        <ul className="space-y-0.5">
          {visibleCategories.map((category) => {
            const inCategory = PROBLEMS.filter((p) => p.category === category.slug);
            const isOpen = categorySlug === category.slug;
            return (
              <li key={category.slug}>
                <NavLink
                  to={`/categories/${category.slug}`}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `flex items-baseline gap-2 border-l-2 py-1.5 pr-2 pl-2 text-sm transition-colors ${
                      isActive
                        ? "border-accent font-medium text-ink"
                        : "border-transparent text-ink-muted hover:border-line-strong hover:text-ink"
                    }`
                  }
                >
                  <span className="w-4 shrink-0 font-mono text-2xs text-ink-faint">
                    {category.number}
                  </span>
                  <span className="flex-1 truncate">{category.title}</span>
                  <span className="shrink-0 font-mono text-2xs text-ink-faint">
                    {inCategory.length}/{category.count}
                  </span>
                </NavLink>

                {isOpen && inCategory.length > 0 ? (
                  <ul className="mb-1 ml-2 border-l border-line pl-2">
                    {inCategory.map((problem) => (
                      <li key={problem.slug}>
                        <NavLink
                          to={`/problems/${problem.category}/${problem.slug}`}
                          onClick={onNavigate}
                          className={({ isActive }) =>
                            `flex items-baseline gap-2 rounded-md px-2 py-1 text-sm transition-colors ${
                              isActive
                                ? "bg-accent-soft font-medium text-accent"
                                : "text-ink-muted hover:bg-surface hover:text-ink"
                            }`
                          }
                        >
                          <span className="font-mono text-2xs text-ink-faint">{problem.id}</span>
                          <span className="flex-1 truncate">{problem.title}</span>
                          <DifficultyLabel difficulty={problem.difficulty} short />
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-line px-3 py-3">
        <ThemeToggle />
      </div>
    </div>
  );
}
