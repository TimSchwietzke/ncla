import { Pause, Play, RotateCcw } from "lucide-react";
import {
  TARGET_SECONDS,
  formatDuration,
  pauseTimer,
  resetTimer,
  startTimer,
  useTimer,
} from "../../lib/timer";
import { setLastAttemptSeconds } from "../../lib/progress";

/**
 * The twenty-minute attempt timer. It counts up rather than down: the point is to know
 * how long you have been at it, not to be interrupted. Past the target it turns and
 * says so once — no sound, no dialog.
 */
export function Timer({ problemId }: { problemId: string }) {
  const { seconds, running, active } = useTimer(problemId);
  const over = seconds >= TARGET_SECONDS;

  function stop(): void {
    pauseTimer();
    if (seconds > 0) setLastAttemptSeconds(problemId, seconds);
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <span
          className={`font-mono text-lg tabular-nums ${over ? "text-danger" : "text-ink"}`}
          aria-live="off"
        >
          {formatDuration(active ? seconds : 0)}
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              if (running) stop();
              else startTimer(problemId);
            }}
            aria-label={running ? "Pause the timer" : "Start the timer"}
            className="rounded-md p-1.5 text-ink-faint transition-colors hover:bg-surface-2 hover:text-ink"
          >
            {running ? <Pause size={14} strokeWidth={1.75} /> : <Play size={14} strokeWidth={1.75} />}
          </button>
          {active && seconds > 0 ? (
            <button
              type="button"
              onClick={() => {
                resetTimer(problemId);
              }}
              aria-label="Reset the timer"
              className="rounded-md p-1.5 text-ink-faint transition-colors hover:bg-surface-2 hover:text-ink"
            >
              <RotateCcw size={13} strokeWidth={1.75} />
            </button>
          ) : null}
        </div>
      </div>

      <p className={`mt-1 font-mono text-2xs ${over ? "text-danger" : "text-ink-faint"}`}>
        {over ? "Twenty minutes. Reveal the next step." : `${formatDuration(TARGET_SECONDS)} target`}
      </p>
    </div>
  );
}
