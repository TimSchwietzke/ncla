import { parseProgressFile, snapshot, type ProgressFile } from "./progress";
import { todayISO } from "./srs";

/**
 * Export and import of the progress file.
 *
 * There is no backend, so this file is the only backup that exists. In the packaged app
 * it goes through Tauri's save dialog; in a browser it falls back to a blob download —
 * a button that silently does nothing would be worse than no button at all.
 */

export interface BackupFile {
  app: "ncla";
  exportedAt: string;
  progress: ProgressFile;
}

const IN_TAURI = typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

export function buildBackup(): BackupFile {
  return { app: "ncla", exportedAt: new Date().toISOString(), progress: snapshot() };
}

export function suggestedFilename(): string {
  return `ncla-progress-${todayISO()}.json`;
}

export type ExportOutcome = { saved: boolean; where?: string };

export async function exportProgress(): Promise<ExportOutcome> {
  const text = JSON.stringify(buildBackup(), null, 2);

  if (IN_TAURI) {
    const [{ save }, { writeTextFile }] = await Promise.all([
      import("@tauri-apps/plugin-dialog"),
      import("@tauri-apps/plugin-fs"),
    ]);
    const path = await save({
      defaultPath: suggestedFilename(),
      filters: [{ name: "JSON", extensions: ["json"] }],
    });
    if (!path) return { saved: false };
    await writeTextFile(path, text);
    return { saved: true, where: path };
  }

  const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = suggestedFilename();
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  return { saved: true, where: suggestedFilename() };
}

/**
 * Reads a file without applying it. The caller shows what is inside and what would be
 * replaced before anything is overwritten — silently discarding weeks of history is the
 * worst thing this page could do.
 */
export function parseBackup(text: string): ProgressFile {
  const raw: unknown = JSON.parse(text);
  if (typeof raw !== "object" || raw === null) {
    throw new Error("That file does not contain anything recognisable.");
  }
  const candidate = raw as Partial<BackupFile>;
  if (candidate.app !== "ncla") {
    throw new Error("That is not an ncla export.");
  }
  const progress = parseProgressFile(candidate.progress);
  if (Object.keys(progress.problems).length === 0) {
    throw new Error("The export is readable but holds no progress.");
  }
  return progress;
}

/** Opens a file and hands back its parsed contents. Null means the user cancelled. */
export async function pickBackup(): Promise<ProgressFile | null> {
  if (!IN_TAURI) throw new Error("Use the file input in a browser.");

  const [{ open }, { readTextFile }] = await Promise.all([
    import("@tauri-apps/plugin-dialog"),
    import("@tauri-apps/plugin-fs"),
  ]);
  const path = await open({ multiple: false, filters: [{ name: "JSON", extensions: ["json"] }] });
  if (typeof path !== "string") return null;
  return parseBackup(await readTextFile(path));
}

export const runningInTauri = IN_TAURI;
