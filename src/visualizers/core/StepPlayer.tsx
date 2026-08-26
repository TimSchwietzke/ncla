import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import type { ArrayStep } from "./types";

/**
 * Plays a precomputed run of frames. It knows nothing about the pattern being shown —
 * the caller hands it the frames and a way to draw one, so a future tree or graph
 * renderer uses the same player (CLAUDE.md §9).
 */

const BASE_FRAME_MS = 950;
const SPEEDS = [0.5, 1, 2] as const;

export function StepPlayer({
  steps,
  render,
  autoPlay = false,
  loop = false,
  controls = true,
  onFrameChange,
}: {
  steps: ArrayStep[];
  render: (step: ArrayStep, animated: boolean) => ReactNode;
  autoPlay?: boolean;
  loop?: boolean;
  controls?: boolean;
  onFrameChange?: (index: number) => void;
}) {
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(autoPlay);
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(1);
  const [animated, setAnimated] = useState(true);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Reduced motion means no self-running animation — stepping by hand still works.
    setAnimated(false);
    setPlaying(false);
  }, []);

  // A different set of frames is a different run.
  useEffect(() => {
    setFrame(0);
    setPlaying(autoPlay && !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, [steps, autoPlay]);

  useEffect(() => {
    onFrameChange?.(frame);
  }, [frame, onFrameChange]);

  const last = Math.max(steps.length - 1, 0);

  const step = useCallback(
    (delta: number) => {
      setFrame((current) => Math.min(Math.max(current + delta, 0), last));
    },
    [last],
  );

  useEffect(() => {
    if (!playing || steps.length === 0) return;

    const timer = window.setTimeout(() => {
      setFrame((current) => {
        if (current < last) return current + 1;
        if (loop) return 0;
        setPlaying(false);
        return current;
      });
    }, BASE_FRAME_MS / speed);

    return () => {
      window.clearTimeout(timer);
    };
  }, [playing, frame, last, loop, speed, steps.length]);

  /**
   * Bound to the container, not the window: a global Space handler would steal page
   * scrolling from anyone who is only reading.
   */
  function onKeyDown(event: React.KeyboardEvent): void {
    switch (event.key) {
      case " ":
        event.preventDefault();
        setPlaying((value) => !value);
        break;
      case "ArrowRight":
        event.preventDefault();
        setPlaying(false);
        step(1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        setPlaying(false);
        step(-1);
        break;
      case "r":
        event.preventDefault();
        setPlaying(false);
        setFrame(0);
        break;
      default:
        break;
    }
  }

  const current = steps[Math.min(frame, last)];
  if (!current) return null;

  return (
    <div
      ref={container}
      tabIndex={controls ? 0 : -1}
      onKeyDown={onKeyDown}
      role="group"
      aria-label="Algorithm player"
      className={
        controls
          ? "my-5 rounded-lg border border-line bg-surface-2 px-3 py-3 focus:outline-none focus-visible:border-accent"
          : undefined
      }
    >
      {render(current, animated)}

      <p className="mx-auto mt-3 flex min-h-[2.5rem] max-w-[54ch] items-start justify-center text-center text-sm text-ink-muted">
        {current.caption}
      </p>

      {controls ? (
        <>
          <div
            className="mt-1 h-[3px] w-full overflow-hidden rounded-full bg-line"
            role="progressbar"
            aria-valuenow={frame + 1}
            aria-valuemin={1}
            aria-valuemax={steps.length}
          >
            <div
              className="h-full bg-accent transition-[width] duration-200"
              style={{ width: `${((frame + 1) / steps.length) * 100}%` }}
            />
          </div>

          <div className="mt-2 flex items-center gap-1">
            <Control
              label="Reset"
              onClick={() => {
                setPlaying(false);
                setFrame(0);
              }}
            >
              <SkipBack size={14} strokeWidth={1.75} />
            </Control>
            <Control
              label="Step back"
              onClick={() => {
                setPlaying(false);
                step(-1);
              }}
              disabled={frame === 0}
            >
              <RotateCcw size={14} strokeWidth={1.75} />
            </Control>
            <Control
              label={playing ? "Pause" : "Play"}
              onClick={() => {
                setPlaying((value) => !value);
              }}
            >
              {playing ? <Pause size={14} strokeWidth={1.75} /> : <Play size={14} strokeWidth={1.75} />}
            </Control>
            <Control
              label="Step forward"
              onClick={() => {
                setPlaying(false);
                step(1);
              }}
              disabled={frame === last}
            >
              <SkipForward size={14} strokeWidth={1.75} />
            </Control>

            <span className="ml-2 font-mono text-2xs text-ink-faint">
              {frame + 1} / {steps.length}
            </span>

            <button
              type="button"
              onClick={() => {
                setSpeed(SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length] ?? 1);
              }}
              className="ml-auto rounded-md px-2 py-1 font-mono text-2xs text-ink-faint transition-colors hover:bg-surface hover:text-ink"
            >
              {speed}×
            </button>

            {current.readout ? (
              <span className="font-mono text-2xs text-ink-faint">{current.readout}</span>
            ) : null}
          </div>

          <p className="mt-1.5 font-mono text-2xs text-ink-faint opacity-70">
            focus this box, then space · ← · → · r
          </p>
        </>
      ) : null}
    </div>
  );
}

function Control({
  label,
  onClick,
  disabled = false,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="rounded-md p-1.5 text-ink-muted transition-colors hover:bg-surface hover:text-ink disabled:opacity-35 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}
