import { NavLink, Outlet } from "react-router";

const NAV = [
  { to: "/", label: "Home", end: true },
  { to: "/method", label: "Method", end: false },
  { to: "/patterns", label: "Patterns", end: false },
  { to: "/categories", label: "Problems", end: false },
  { to: "/review", label: "Review", end: false },
  { to: "/progress", label: "Progress", end: false },
  { to: "/cheat-sheet", label: "Cheat sheet", end: false },
];

export function AppShell() {
  return (
    <div className="min-h-dvh">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3">
          <NavLink to="/" className="text-lg font-semibold tracking-tight">
            NCLA
          </NavLink>
          <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  isActive
                    ? "font-medium text-accent"
                    : "text-muted transition-colors hover:text-ink"
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8">
        <Outlet />
      </main>

      <footer className="mx-auto max-w-5xl px-5 pb-10 text-xs text-muted">
        NeetCode 150 · personal preparation · everything is stored locally
      </footer>
    </div>
  );
}
