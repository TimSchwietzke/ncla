import { useSyncExternalStore } from "react";

export type ThemePreference = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "ncla.theme";

const listeners = new Set<() => void>();
let preference: ThemePreference = readStoredPreference();

const darkQuery =
  typeof window !== "undefined" ? window.matchMedia("(prefers-color-scheme: dark)") : null;

function readStoredPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") return stored;
  } catch {
    // Private mode or blocked storage — fall through to the default.
  }
  return "system";
}

/** Turns the preference into the theme actually painted. */
export function resolveTheme(value: ThemePreference): "light" | "dark" {
  if (value !== "system") return value;
  return darkQuery?.matches ? "dark" : "light";
}

function apply(): void {
  document.documentElement.dataset["theme"] = resolveTheme(preference);
}

export function setThemePreference(next: ThemePreference): void {
  preference = next;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // Not being able to remember the choice is not a reason to refuse it.
  }
  apply();
  for (const listener of listeners) listener();
}

export function getThemePreference(): ThemePreference {
  return preference;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Keeps "system" honest when the OS switches while the app is open. */
darkQuery?.addEventListener("change", () => {
  if (preference !== "system") return;
  apply();
  for (const listener of listeners) listener();
});

export function useTheme(): {
  preference: ThemePreference;
  resolved: "light" | "dark";
  setPreference: (next: ThemePreference) => void;
} {
  const current = useSyncExternalStore(subscribe, getThemePreference, () => "system" as const);
  return {
    preference: current,
    resolved: resolveTheme(current),
    setPreference: setThemePreference,
  };
}
