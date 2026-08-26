import { useEffect, useMemo, useState } from "react";
import { NavLink, useParams } from "react-router";
import {
  BookOpen,
  ChartColumn,
  ChevronRight,
  Compass,
  LayoutDashboard,
  PanelLeftClose,
  RotateCcw,
  Search,
  Shapes,
  type LucideIcon,
} from "lucide-react";
import { CATEGORIES, TOTAL_PROBLEMS } from "../../data/categories";
import { PROBLEMS } from "../../lib/content";
import { ThemeToggle } from "./ThemeToggle";
import { DifficultyLabel } from "../ui/DifficultyLabel";

const SECTIONS: { to: string; label: string; icon: LucideIcon }[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/method", label: "Method", icon: Compass },
  { to: "/patterns", label: "Patterns", icon: Shapes },
  { to: "/review", label: "Review", icon: RotateCcw },
  { to: "/progress", label: "Progress", icon: ChartColumn },
  { to: "/cheat-sheet", label: "Cheat sheet", icon: BookOpen },
];

const OPEN_KEY = "ncla.sidebar.open";

function readOpen(): string[] {
  try {
    const raw = localStorage.getItem(OPEN_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

export function Sidebar({
  onNavigate,
  onCollapse,
}: {
  onNavigate?: () => void;
  onCollapse?: () => void;
}) {
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState<string[]>(readOpen);
  const { categorySlug } = useParams();
  const query = filter.trim().toLowerCase();

  // Walking into a category opens its folder, the way a file tree reveals the active file.
  useEffect(() => {
    if (!categorySlug) return;
    setOpen((current) => (current.includes(categorySlug) ? current : [...current, categorySlug]));
  }, [categorySlug]);

  useEffect(() => {
    try {
      localStorage.setItem(OPEN_KEY, JSON.stringify(open));
    } catch {
      // Not remembering which folders were open is survivable.
    }
  }, [open]);

  const written = PROBLEMS.length;

  const matches = useMemo(
    () =>
      query === ""
        ? []
        : PROBLEMS.filter((p) => p.title.toLowerCase().includes(query) || p.id.startsWith(query)),
    [query],
  );

  const visibleCategories = useMemo(
    () =>
      query === "" ? CATEGORIES : CATEGORIES.filter((c) => c.title.toLowerCase().includes(query)),
    [query],
  );

  function toggle(slug: string): void {
    setOpen((current) =>
      current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug],
    );
  }

  return (
    <div className="flex h-full flex-col border-r border-line bg-surface-2">
      <div className="border-b border-line px-4 py-4">
        <div className="flex items-center justify-between gap-2">
          <NavLink to="/" onClick={onNavigate} className="min-w-0 truncate">
            <span className="text-lg font-semibold tracking-tight">ncla</span>
            <span className="ml-2 font-mono text-2xs text-ink-faint">neetcode 150</span>
          </NavLink>
          {onCollapse ? (
            <button
              type="button"
              onClick={onCollapse}
              aria-label="Collapse sidebar"
              title="Collapse sidebar (Ctrl+B)"
              className="hidden shrink-0 rounded-md p-1 text-ink-faint transition-colors hover:bg-surface hover:text-ink lg:block"
            >
              <PanelLeftClose size={15} strokeWidth={1.75} />
            </button>
          ) : null}
        </div>

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
        <div className="relative">
          <Search
            size={13}
            strokeWidth={1.75}
            className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-ink-faint"
          />
          <input
            type="search"
            value={filter}
            onChange={(event) => {
              setFilter(event.target.value);
            }}
            placeholder="Filter problems"
            aria-label="Filter problems"
            className="w-full rounded-md border border-line bg-surface py-1.5 pr-2.5 pl-7 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
          />
        </div>
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
                    `flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-colors ${
                      isActive
                        ? "bg-accent-soft font-medium text-accent"
                        : "text-ink-muted hover:bg-surface hover:text-ink"
                    }`
                  }
                >
                  <section.icon size={15} strokeWidth={1.75} className="shrink-0" />
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
            const isOpen = open.includes(category.slug);

            return (
              <li key={category.slug}>
                <div className="flex items-stretch">
                  <button
                    type="button"
                    onClick={() => {
                      toggle(category.slug);
                    }}
                    aria-expanded={isOpen}
                    aria-label={`${isOpen ? "Collapse" : "Expand"} ${category.title}`}
                    className="flex w-5 shrink-0 items-center justify-center text-ink-faint transition-colors hover:text-ink"
                  >
                    <ChevronRight
                      size={13}
                      strokeWidth={2}
                      className={`transition-transform duration-150 ${isOpen ? "rotate-90" : ""}`}
                    />
                  </button>

                  <NavLink
                    to={`/categories/${category.slug}`}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `flex min-w-0 flex-1 items-baseline gap-2 rounded-md px-1.5 py-1.5 text-sm transition-colors ${
                        isActive
                          ? "bg-accent-soft font-medium text-accent"
                          : "text-ink-muted hover:bg-surface hover:text-ink"
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
                </div>

                {isOpen ? (
                  <ul className="my-0.5 ml-[10px] border-l border-line pl-2">
                    {inCategory.length === 0 ? (
                      <li className="px-2 py-1 font-mono text-2xs text-ink-faint">
                        nothing written up yet
                      </li>
                    ) : (
                      inCategory.map((problem) => (
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
                      ))
                    )}
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
