import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { getCategory } from "../data/categories";
import { getPattern } from "../data/patterns";
import { findProblem } from "../lib/content";
import { Sidebar } from "./Sidebar";
import { PanelIcon } from "./icons";

const COLLAPSE_KEY = "ncla.sidebar.collapsed";

function readCollapsed(): boolean {
  try {
    return localStorage.getItem(COLLAPSE_KEY) === "true";
  } catch {
    return false;
  }
}

interface Crumb {
  label: string;
  to?: string;
}

function useBreadcrumb(): Crumb[] {
  const { pathname } = useLocation();
  const [head, ...rest] = pathname.split("/").filter(Boolean);

  switch (head) {
    case undefined:
      return [];
    case "method":
      return [{ label: "Method" }];
    case "review":
      return [{ label: "Review" }];
    case "progress":
      return [{ label: "Progress" }];
    case "cheat-sheet":
      return [{ label: "Cheat sheet" }];
    case "patterns": {
      const slug = rest[0];
      if (!slug) return [{ label: "Patterns" }];
      return [
        { label: "Patterns", to: "/patterns" },
        { label: getPattern(slug)?.title ?? slug },
      ];
    }
    case "categories": {
      const slug = rest[0];
      if (!slug) return [{ label: "Problems" }];
      return [
        { label: "Problems", to: "/categories" },
        { label: getCategory(slug)?.title ?? slug },
      ];
    }
    case "problems": {
      const [categorySlug, problemSlug] = rest;
      if (!categorySlug || !problemSlug) return [{ label: "Problems", to: "/categories" }];
      const category = getCategory(categorySlug);
      const problem = findProblem(categorySlug, problemSlug);
      return [
        { label: "Problems", to: "/categories" },
        { label: category?.title ?? categorySlug, to: `/categories/${categorySlug}` },
        { label: problem?.title ?? problemSlug },
      ];
    }
    default:
      return [];
  }
}

export function AppShell() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const crumbs = useBreadcrumb();
  const { pathname } = useLocation();

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSE_KEY, String(collapsed));
    } catch {
      // Not remembering the choice is not a reason to refuse it.
    }
  }, [collapsed]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false);
      // Ctrl/Cmd + B — the shortcut every editor uses for this.
      if (event.key.toLowerCase() === "b" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setCollapsed((value) => !value);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div
      // grid-template-columns is not interpolable, so a transition here just flips
      // late and reads as lag. Toggling instantly is the snappier, honest choice.
      className={`min-h-dvh lg:grid ${
        collapsed ? "lg:grid-cols-[0px_minmax(0,1fr)]" : "lg:grid-cols-[260px_minmax(0,1fr)]"
      }`}
    >
      <aside
        className={`hidden overflow-hidden lg:sticky lg:top-0 lg:h-dvh ${
          collapsed ? "lg:hidden" : "lg:block"
        }`}
      >
        <Sidebar
          onCollapse={() => {
            setCollapsed(true);
          }}
        />
      </aside>

      {drawerOpen ? (
        <>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => {
              setDrawerOpen(false);
            }}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-[280px] lg:hidden">
            <Sidebar
              onNavigate={() => {
                setDrawerOpen(false);
              }}
            />
          </aside>
        </>
      ) : null}

      <div className="flex min-h-dvh min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-bg/90 px-5 py-2.5 backdrop-blur">
          <button
            type="button"
            onClick={() => {
              setDrawerOpen(true);
            }}
            aria-label="Open navigation"
            className="rounded-md border border-line px-2 py-1 font-mono text-2xs text-ink-muted lg:hidden"
          >
            menu
          </button>

          {collapsed ? (
            <button
              type="button"
              onClick={() => {
                setCollapsed(false);
              }}
              aria-label="Expand sidebar"
              title="Expand sidebar (Ctrl+B)"
              className="hidden shrink-0 rounded-md border border-line p-1 text-ink-faint transition-colors hover:text-ink lg:block"
            >
              <PanelIcon collapsed />
            </button>
          ) : null}

          <nav aria-label="Breadcrumb" className="min-w-0 truncate font-mono text-2xs text-ink-faint">
            <Link to="/" className="hover:text-ink">
              ncla
            </Link>
            {crumbs.map((crumb) => (
              <span key={crumb.label}>
                <span className="mx-1.5">/</span>
                {crumb.to ? (
                  <Link to={crumb.to} className="hover:text-ink">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-ink-muted">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        </header>

        <main className="flex-1 px-5 py-8 lg:px-10">
          <Outlet />
        </main>

        <footer className="px-5 pb-8 font-mono text-2xs text-ink-faint lg:px-10">
          everything is stored locally · no backend
        </footer>
      </div>
    </div>
  );
}
