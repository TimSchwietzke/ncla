import { useProblemProgress } from "../../lib/progress";
import { maturity, overdueDays, RATING_MEANING } from "../../lib/srs";

/** Where this problem stands in the schedule. Status only — rating happens inline. */
export function ScheduleStatus({ problemId }: { problemId: string }) {
  const progress = useProblemProgress(problemId);

  if (progress.rating === undefined) {
    return <p className="font-mono text-2xs text-ink-faint">not rated yet</p>;
  }

  const overdue = overdueDays(progress.dueOn);
  const state = maturity(progress.intervalDays);

  return (
    <dl className="space-y-1 font-mono text-2xs">
      <div className="flex justify-between gap-2">
        <dt className="text-ink-faint">last</dt>
        <dd className="text-ink">
          {progress.rating} · {RATING_MEANING[progress.rating]}
        </dd>
      </div>
      <div className="flex justify-between gap-2">
        <dt className="text-ink-faint">streak</dt>
        <dd className="text-ink">{progress.streak ?? 0}</dd>
      </div>
      <div className="flex justify-between gap-2">
        <dt className="text-ink-faint">interval</dt>
        <dd className="text-ink">
          {progress.intervalDays ?? 0}d · {state}
        </dd>
      </div>
      <div className="flex justify-between gap-2">
        <dt className="text-ink-faint">due</dt>
        <dd className={overdue > 0 ? "text-danger" : "text-ink"}>
          {overdue > 0
            ? `${overdue}d overdue`
            : overdue === 0
              ? "today"
              : `in ${Math.abs(overdue)}d`}
        </dd>
      </div>
    </dl>
  );
}
