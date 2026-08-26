import { useRef, useState, type ReactNode } from "react";
import { Download, Upload } from "lucide-react";
import { CATEGORIES, TOTAL_PROBLEMS } from "../data/categories";
import { PROBLEMS } from "../lib/content";
import { replaceAll, useProgress, type ProgressFile } from "../lib/progress";
import { exportProgress, parseBackup, pickBackup, runningInTauri } from "../lib/backup";
import { isDue, maturity } from "../lib/srs";
import { ProgressMosaic } from "../components/ui/ProgressMosaic";
import { PageHeader, Rows } from "../components/ui/primitives";

function Section({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <section className="mb-10">
      <div className="mb-3 flex items-baseline justify-between gap-4 border-b border-line pb-2">
        <h2 className="font-mono text-2xs uppercase tracking-wider text-ink-faint">{label}</h2>
        {hint ? <span className="font-mono text-2xs text-ink-faint">{hint}</span> : null}
      </div>
      {children}
    </section>
  );
}

function Tally({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="rounded-lg border border-line bg-surface px-3 py-2.5">
      <p className="font-mono text-xl text-ink">{value}</p>
      <p className="mt-0.5 font-mono text-2xs uppercase tracking-wide text-ink-faint">{label}</p>
    </div>
  );
}

export default function Progress() {
  const file = useProgress();
  const fileInput = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<ProgressFile | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const attempted = PROBLEMS.filter((p) => file.problems[p.slug]?.rating !== undefined).length;
  const due = PROBLEMS.filter((p) => isDue(file.problems[p.slug]?.dueOn)).length;
  const mature = PROBLEMS.filter(
    (p) => maturity(file.problems[p.slug]?.intervalDays) === "mature",
  ).length;

  async function onExport(): Promise<void> {
    try {
      const outcome = await exportProgress();
      setMessage(outcome.saved ? `Saved to ${outcome.where}` : "Export cancelled.");
    } catch (error) {
      setMessage(`Export failed: ${String(error)}`);
    }
  }

  async function onPick(): Promise<void> {
    try {
      const parsed = await pickBackup();
      if (parsed) setPending(parsed);
    } catch (error) {
      setMessage(String(error));
    }
  }

  function onFileChosen(input: HTMLInputElement): void {
    const chosen = input.files?.[0];
    if (!chosen) return;
    void chosen
      .text()
      .then((text) => {
        setPending(parseBackup(text));
        setMessage(null);
      })
      .catch((error: unknown) => {
        setMessage(String(error));
      });
    input.value = "";
  }

  return (
    <div className="max-w-[76ch]">
      <PageHeader title="Progress" lead="Where you stand, and the only backup that exists." />

      <div className="mb-10 grid gap-2 sm:grid-cols-4">
        <Tally value={`${attempted}/${PROBLEMS.length}`} label="attempted" />
        <Tally value={due} label="due now" />
        <Tally value={mature} label="mature" />
        <Tally value={`${PROBLEMS.length}/${TOTAL_PROBLEMS}`} label="written up" />
      </div>

      <Section label="The whole list" hint="by how well it sticks">
        <ProgressMosaic colorBy="mastery" />
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 font-mono text-2xs text-ink-faint">
          <li className="flex items-center gap-1.5">
            <span className="h-2.5 w-2 rounded-[1px] bg-line" /> not written up
          </li>
          <li className="flex items-center gap-1.5">
            <span className="h-2.5 w-2 rounded-[1px] bg-line-strong" /> written, untried
          </li>
          <li className="flex items-center gap-1.5">
            <span className="h-2.5 w-2 rounded-[1px] bg-accent opacity-45" /> learning
          </li>
          <li className="flex items-center gap-1.5">
            <span className="h-2.5 w-2 rounded-[1px] bg-accent" /> mature, 21 days or more
          </li>
        </ul>
      </Section>

      <Section label="By category">
        <Rows>
          {CATEGORIES.map((category) => {
            const written = PROBLEMS.filter((p) => p.category === category.slug);
            const tried = written.filter((p) => file.problems[p.slug]?.rating !== undefined).length;
            const solid = written.filter(
              (p) => maturity(file.problems[p.slug]?.intervalDays) === "mature",
            ).length;
            return (
              <li key={category.slug} className="flex items-baseline gap-3 px-4 py-2.5">
                <span className="w-6 shrink-0 font-mono text-2xs text-ink-faint">
                  {category.number}
                </span>
                <span className="flex-1 truncate">{category.title}</span>
                <span className="h-1 w-20 shrink-0 overflow-hidden rounded-full bg-line">
                  <span
                    className="block h-full bg-accent"
                    style={{ width: `${(solid / category.count) * 100}%` }}
                  />
                </span>
                <span className="w-24 shrink-0 text-right font-mono text-2xs text-ink-faint">
                  {tried} tried · {solid} solid
                </span>
              </li>
            );
          })}
        </Rows>
      </Section>

      <Section label="Backup" hint="no backend, so this is it">
        <div className="rounded-lg border border-line bg-surface px-4 py-4">
          <p className="mb-3 text-sm text-ink-muted">
            Everything lives in this browser profile. The export is the only way progress survives a
            cleared cache, a new machine, or the move between the browser and the desktop window —
            those two do not share storage.
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void onExport()}
              className="flex items-center gap-1.5 rounded-md border border-accent bg-accent-soft px-3 py-1.5 font-mono text-2xs text-accent transition-colors hover:bg-accent hover:text-bg"
            >
              <Download size={13} strokeWidth={1.75} />
              export
            </button>

            <button
              type="button"
              onClick={() => {
                if (runningInTauri) void onPick();
                else fileInput.current?.click();
              }}
              className="flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 font-mono text-2xs text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
            >
              <Upload size={13} strokeWidth={1.75} />
              import
            </button>

            <input
              ref={fileInput}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(event) => {
                onFileChosen(event.currentTarget);
              }}
            />
          </div>

          {message ? <p className="mt-3 font-mono text-2xs text-ink-faint">{message}</p> : null}

          {pending ? (
            <div className="mt-4 border-t border-line pt-3">
              <p className="text-sm text-ink">
                That file holds{" "}
                <span className="font-mono">{Object.keys(pending.problems).length}</span>{" "}
                {Object.keys(pending.problems).length === 1 ? "problem" : "problems"}. You currently
                have <span className="font-mono">{Object.keys(file.problems).length}</span>.
                Importing replaces everything — it does not merge.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    replaceAll(pending);
                    setPending(null);
                    setMessage("Progress replaced.");
                  }}
                  className="rounded-md border border-danger px-3 py-1.5 font-mono text-2xs text-danger transition-colors hover:bg-danger hover:text-bg"
                >
                  replace
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPending(null);
                  }}
                  className="rounded-md border border-line px-3 py-1.5 font-mono text-2xs text-ink-muted transition-colors hover:text-ink"
                >
                  cancel
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </Section>
    </div>
  );
}
