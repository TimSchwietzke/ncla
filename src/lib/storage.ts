/**
 * The only place that touches localStorage. Everything here fails quietly: a browser
 * with storage blocked should still run the app, just without remembering anything.
 */

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private mode, a full quota, or a browser set to block site data.
  }
}

export function removeKey(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Nothing to recover from.
  }
}
