import type { ReactNode } from "react";
import { CircleCheck, Lock, Pause, Play, SkipForward } from "lucide-react";

/**
 * Stylised drawings of the app's own screens for the landing page. Deliberately
 * simplified — they carry the idea of a screen, they are not screenshots.
 */

function MockWindow({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface">
      <div className="flex items-center justify-between border-b border-line bg-surface-2 px-3 py-2">
        <span className="font-mono text-2xs text-ink-faint">{title}</span>
        <span className="flex gap-1" aria-hidden="true">
          <span className="h-1.5 w-1.5 rounded-full bg-line-strong" />
          <span className="h-1.5 w-1.5 rounded-full bg-line-strong" />
        </span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <p className="font-mono text-2xs uppercase text-ink-faint">{children}</p>;
}

/** "Which pattern is this problem wearing?" */
export function SignalsMock() {
  return (
    <MockWindow title="two-sum · signals">
      <Label>Signals</Label>
      <ul className="mt-2 space-y-2 text-sm text-ink-muted">
        <li className="flex gap-2">
          <span className="text-accent">·</span>
          <span>
            The question is <span className="text-ink">“does a value exist?”</span> — membership,
            not ordering.
          </span>
        </li>
        <li className="flex gap-2">
          <span className="text-accent">·</span>
          <span>
            The answer is a pair of <span className="text-ink">indices</span>, so sorting costs you
            the answer.
          </span>
        </li>
        <li className="flex gap-2">
          <span className="text-accent">·</span>
          <span>
            <span className="font-mono text-ink">n ≤ 10⁴</span> — the nested loop is what you are
            expected to beat.
          </span>
        </li>
      </ul>

      <div className="mt-4 flex items-center gap-2 border-t border-line pt-3">
        <Label>Pattern</Label>
        <span className="rounded-md border border-accent bg-accent-soft px-2 py-0.5 font-mono text-2xs text-accent">
          hashing / complement
        </span>
      </div>
    </MockWindow>
  );
}

/** The interview arc: name the naive answer, then beat it. */
export function CodeMock() {
  return (
    <MockWindow title="two-sum · solution">
      <div className="rounded-md border border-line bg-surface-2 opacity-60">
        <div className="flex items-center justify-between border-b border-line px-2.5 py-1">
          <span className="font-mono text-2xs text-ink-faint">python · brute force</span>
          <span className="font-mono text-2xs text-ink-faint">O(n²)</span>
        </div>
        <pre className="overflow-x-auto px-2.5 py-2 font-mono text-2xs leading-relaxed text-ink-muted">
{`for i in range(len(nums)):
    for j in range(i + 1, len(nums)):
        if nums[i] + nums[j] == target:`}
        </pre>
      </div>

      <p className="my-2 text-center font-mono text-2xs text-ink-faint">
        the inner loop is a lookup ↓
      </p>

      <div className="rounded-md border border-accent bg-surface-2">
        <div className="flex items-center justify-between border-b border-line px-2.5 py-1">
          <span className="font-mono text-2xs text-accent">python · optimal</span>
          <span className="font-mono text-2xs text-accent">O(n)</span>
        </div>
        <pre className="overflow-x-auto px-2.5 py-2 font-mono text-2xs leading-relaxed text-ink">
{`for i, x in enumerate(nums):
    if target - x in seen:
        return [seen[target - x], i]
    seen[x] = i`}
        </pre>
      </div>
    </MockWindow>
  );
}

const STAGES = [
  { label: "Problem and constraints", open: true },
  { label: "Target complexity", open: true },
  { label: "Pattern hint", open: true },
  { label: "The insight", open: false },
  { label: "Approach", open: false },
  { label: "Solution", open: false },
];

/** Nothing is spoiled until you ask for it. */
export function RevealMock() {
  return (
    <MockWindow title="learn mode">
      <ul className="space-y-1.5">
        {STAGES.map((stage) => (
          <li
            key={stage.label}
            className={`flex items-center gap-2.5 rounded-md border px-3 py-2 text-sm ${
              stage.open
                ? "border-line bg-surface-2 text-ink"
                : "border-dashed border-line text-ink-faint"
            }`}
          >
            {stage.open ? (
              <CircleCheck size={14} strokeWidth={1.75} className="shrink-0 text-accent" />
            ) : (
              <Lock size={14} strokeWidth={1.75} className="shrink-0" />
            )}
            {stage.label}
          </li>
        ))}
      </ul>
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        className="mt-3 w-full cursor-default rounded-md border border-accent bg-accent-soft py-1.5 font-mono text-2xs text-accent"
      >
        reveal the insight
      </button>
    </MockWindow>
  );
}

/** The visualizer, drawn rather than run. */
export function VisualizerMock() {
  const cells = [2, 7, 11, 15, 3, 6];
  return (
    <MockWindow title="two-pointer · three-sum">
      <div className="flex justify-center gap-1.5">
        {cells.map((value, index) => {
          const active = index === 1 || index === 4;
          return (
            <div key={index} className="flex flex-col items-center gap-1">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-md border font-mono text-sm ${
                  active
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-line bg-surface-2 text-ink-faint"
                }`}
              >
                {value}
              </div>
              <span className="font-mono text-2xs text-accent">
                {index === 1 ? "l" : index === 4 ? "r" : " "}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-center text-sm text-ink-muted">
        Sum is too small — move the left pointer inwards.
      </p>

      <div className="mt-3 flex items-center justify-center gap-3 border-t border-line pt-3 text-ink-faint">
        <Play size={14} strokeWidth={1.75} />
        <Pause size={14} strokeWidth={1.75} />
        <SkipForward size={14} strokeWidth={1.75} />
        <span className="ml-1 h-1 w-24 overflow-hidden rounded-full bg-line">
          <span className="block h-full w-1/3 bg-accent" />
        </span>
        <span className="font-mono text-2xs">4 / 12</span>
      </div>
    </MockWindow>
  );
}

const SCHEDULE = [
  { day: 1, label: "no idea" },
  { day: 2, label: "needed the insight" },
  { day: 3, label: "with hints" },
  { day: 7, label: "alone, slow" },
  { day: 14, label: "alone, clean" },
];

/** What a rating buys you: the next date. */
export function ScheduleGraphic() {
  const max = 14;
  return (
    <MockWindow title="spaced repetition">
      <ul className="space-y-2.5">
        {SCHEDULE.map((entry, index) => (
          <li key={entry.day} className="flex items-center gap-3">
            <span className="w-4 shrink-0 font-mono text-2xs text-ink-faint">{index + 1}</span>
            <span className="flex-1 text-sm text-ink-muted">{entry.label}</span>
            <span className="h-1.5 w-32 overflow-hidden rounded-full bg-line">
              <span
                className="block h-full rounded-full bg-accent"
                style={{ width: `${(entry.day / max) * 100}%` }}
              />
            </span>
            <span className="w-14 shrink-0 text-right font-mono text-2xs text-ink">
              {entry.day}d
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 border-t border-line pt-3 font-mono text-2xs text-ink-faint">
        two clean runs in a row → interval × 2.2, capped at 90 days
      </p>
    </MockWindow>
  );
}
