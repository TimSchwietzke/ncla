import { useEffect, useState } from "react";
import { CalendarClock } from "lucide-react";
import { rateProblem, setNote, useProblemProgress } from "../../lib/progress";
import { RATING_MEANING, previewInterval, type Rating } from "../../lib/srs";
import { formatDuration } from "../../lib/timer";

const RATINGS: Rating[] = [1, 2, 3, 4, 5];

function formatDue(iso: string): string {
  const [year = 0, month = 1, day = 1] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

/**
 * Deliberately not behind the ladder: solving a problem without revealing anything is
 * exactly what a 5 means, and that has to be ratable.
 *
 * Hovering a number shows the interval it buys, so the self-assessment is made with the
 * consequence in view rather than by feel.
 */
export function RatingBar({ problemId }: { problemId: string }) {
  const progress = useProblemProgress(problemId);
  const [hovered, setHovered] = useState<Rating | null>(null);
  const [draft, setDraft] = useState(progress.note ?? "");

  useEffect(() => {
    setDraft(progress.note ?? "");
  }, [problemId, progress.note]);

  const shown = hovered ?? progress.rating ?? null;
  const previous = { streak: progress.streak, intervalDays: progress.intervalDays };

  return (
    <section className="mb-9 rounded-lg border border-line bg-surface">
      <div className="flex items-baseline justify-between gap-3 border-b border-line px-4 py-2">
        <h2 className="font-mono text-2xs uppercase tracking-wide text-ink-faint">
          How did that go?
        </h2>
        {progress.lastAttemptSeconds ? (
          <span className="font-mono text-2xs text-ink-faint">
            {formatDuration(progress.lastAttemptSeconds)} on the clock
          </span>
        ) : null}
      </div>

      <div className="px-4 py-3">
        <div
          className="flex gap-1.5"
          onMouseLeave={() => {
            setHovered(null);
          }}
        >
          {RATINGS.map((rating) => {
            const active = progress.rating === rating;
            return (
              <button
                key={rating}
                type="button"
                onMouseEnter={() => {
                  setHovered(rating);
                }}
                onFocus={() => {
                  setHovered(rating);
                }}
                onClick={() => {
                  rateProblem(problemId, rating);
                }}
                aria-pressed={active}
                aria-label={`${rating} — ${RATING_MEANING[rating]}`}
                className={`flex-1 rounded-md border py-2 font-mono text-sm transition-colors ${
                  active
                    ? "border-accent bg-accent text-bg"
                    : "border-line text-ink-muted hover:border-accent hover:text-accent"
                }`}
              >
                {rating}
              </button>
            );
          })}
        </div>

        <p className="mt-2 min-h-[1.25rem] font-mono text-2xs text-ink-faint">
          {shown ? (
            <>
              <span className="text-ink">{RATING_MEANING[shown]}</span>
              {" · comes back in "}
              {previewInterval(previous, shown)}
              {previewInterval(previous, shown) === 1 ? " day" : " days"}
            </>
          ) : (
            "1 no idea · 2 needed the insight · 3 with hints · 4 alone, slow · 5 alone, clean"
          )}
        </p>

        <label className="mt-4 block">
          <span className="font-mono text-2xs uppercase tracking-wide text-ink-faint">
            What did I miss?
          </span>
          <textarea
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value);
            }}
            // Saved on blur — a note is a thought, not a keystroke stream.
            onBlur={() => {
              if (draft !== (progress.note ?? "")) setNote(problemId, draft);
            }}
            rows={2}
            placeholder="The bit that would have saved you twenty minutes."
            className="mt-1.5 w-full resize-y rounded-md border border-line bg-bg px-2.5 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
          />
        </label>

        {progress.dueOn ? (
          <p className="mt-3 flex items-center gap-1.5 border-t border-line pt-3 font-mono text-2xs text-ink-faint">
            <CalendarClock size={12} strokeWidth={1.75} />
            back on <span className="text-ink">{formatDue(progress.dueOn)}</span>
            {progress.streak ? ` · streak ${progress.streak}` : null}
          </p>
        ) : null}
      </div>
    </section>
  );
}
