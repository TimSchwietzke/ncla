import { useEffect, useState } from "react";
import { ArrayTrack } from "../../visualizers/core/ArrayTrack";
import { buildFixedWindow } from "../../visualizers/sliding-window/steps";
import { buildSteps as twoPointer } from "../../visualizers/two-pointer/steps";
import { buildSteps as binarySearch } from "../../visualizers/binary-search/steps";

/**
 * The hero graphic: three patterns taking turns on the same track, built from the
 * real visualizer primitives rather than a drawing. Same length arrays everywhere so
 * the cells do not resize between shows.
 */
const SORTED = [2, 3, 5, 8, 11, 15, 17, 20, 24, 29];

const SHOWS = [
  {
    label: "sliding window",
    steps: buildFixedWindow({ values: [3, 1, 4, 1, 5, 9, 2, 6, 5, 3], k: 4 }),
  },
  {
    label: "two pointers",
    steps: twoPointer({ values: SORTED, target: 23 }),
  },
  {
    label: "binary search",
    steps: binarySearch({ values: SORTED, target: 17 }),
  },
];

const FRAME_MS = 1050;
const HOLD_MS = 2100;

export function HeroVisualizer() {
  // Which pattern greets you varies by visit — the first impression should not be identical every time.
  const [show, setShow] = useState(() => Math.floor(Date.now() / 1000) % SHOWS.length);
  const [frame, setFrame] = useState(0);
  const [paused, setPaused] = useState(false);
  const [animated, setAnimated] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setAnimated(false);
  }, []);

  const steps = SHOWS[show]?.steps ?? [];
  const isLast = frame >= steps.length - 1;

  useEffect(() => {
    if (!animated || paused || steps.length === 0) return;

    const timer = window.setTimeout(
      () => {
        if (isLast) {
          setShow((current) => (current + 1) % SHOWS.length);
          setFrame(0);
        } else {
          setFrame((current) => current + 1);
        }
      },
      isLast ? HOLD_MS : FRAME_MS,
    );

    return () => {
      window.clearTimeout(timer);
    };
  }, [animated, paused, isLast, steps.length, show, frame]);

  // With reduced motion there is no loop, so show the finished state instead of a start frame.
  useEffect(() => {
    if (!animated) setFrame(Math.max(steps.length - 1, 0));
  }, [animated, steps.length]);

  const step = steps[Math.min(frame, steps.length - 1)];
  if (!step) return null;

  return (
    <div
      onMouseEnter={() => {
        setPaused(true);
      }}
      onMouseLeave={() => {
        setPaused(false);
      }}
    >
      <ArrayTrack step={step} animated={animated} />

      <p className="mx-auto mt-4 flex min-h-[3rem] max-w-[52ch] items-start justify-center text-center text-sm text-ink-muted">
        {step.caption}
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {SHOWS.map((entry, index) => {
          const active = index === show;
          return (
            <button
              key={entry.label}
              type="button"
              onClick={() => {
                setShow(index);
                setFrame(0);
              }}
              aria-current={active}
              className={`rounded-md border px-2.5 py-1 font-mono text-2xs transition-colors ${
                active
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-line text-ink-faint hover:border-line-strong hover:text-ink"
              }`}
            >
              {entry.label}
            </button>
          );
        })}
      </div>

      {step.readout ? (
        <p className="mt-3 text-center font-mono text-2xs text-ink-faint">
          {step.readout}
          {animated ? (
            <span className="ml-2 opacity-70">
              · {Math.min(frame + 1, steps.length)}/{steps.length}
              {paused ? " · paused" : ""}
            </span>
          ) : null}
        </p>
      ) : null}
    </div>
  );
}
