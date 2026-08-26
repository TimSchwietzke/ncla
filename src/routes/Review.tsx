import { useState, type ReactNode } from "react";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { useProgress } from "../lib/progress";
import { dueList, newList, shakyList, type QueueEntry } from "../lib/queue";
import { RATING_MEANING } from "../lib/srs";
import { DifficultyLabel } from "../components/ui/DifficultyLabel";
import { EmptyState, PageHeader, Rows } from "../components/ui/primitives";

const DAILY_DOSE = 4;

function Queue({ entries, trailing }: { entries: QueueEntry[]; trailing: (e: QueueEntry) => string }) {
  return (
    <Rows>
      {entries.map(({ meta, ...rest }) => (
        <li key={meta.slug}>
          <Link
            to={`/problems/${meta.category}/${meta.slug}`}
            className="flex items-baseline gap-3 px-4 py-2.5 transition-colors hover:bg-surface-2"
          >
            <span className="w-8 shrink-0 font-mono text-2xs text-ink-faint">{meta.id}</span>
            <span className="flex-1 truncate font-medium">{meta.title}</span>
            <span className="shrink-0 font-mono text-2xs text-ink-faint">
              {trailing({ meta, ...rest })}
            </span>
            <DifficultyLabel difficulty={meta.difficulty} />
          </Link>
        </li>
      ))}
    </Rows>
  );
}

function Section({
  label,
  count,
  hint,
  children,
}: {
  label: string;
  count: number;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-10">
      <div className="mb-3 flex items-baseline justify-between gap-4 border-b border-line pb-2">
        <h2 className="font-mono text-2xs uppercase tracking-wider text-ink-faint">
          {label} <span className="ml-1 text-ink">{count}</span>
        </h2>
        {hint ? <span className="font-mono text-2xs text-ink-faint">{hint}</span> : null}
      </div>
      {children}
    </section>
  );
}

export default function Review() {
  const file = useProgress();
  const due = dueList(file);
  const fresh = newList(file);
  const shaky = shakyList(file);

  // Shaky stays out of the way until the top of the page is cleared.
  const topCleared = due.length === 0 && fresh.length === 0;
  const [shakyOpen, setShakyOpen] = useState(false);
  const showShaky = shakyOpen || topCleared;

  return (
    <div className="max-w-[76ch]">
      <PageHeader
        title="Due today"
        lead="Work the top of the page and stop. Two problems genuinely understood beat eight ticked off."
      />

      <Section
        label="Due"
        count={due.length}
        hint={due.length > 0 ? "most overdue first, then hardest" : undefined}
      >
        {due.length === 0 ? (
          <EmptyState>Nothing is due. Take a new one below, or take the day off.</EmptyState>
        ) : (
          <Queue
            entries={due}
            trailing={(entry) =>
              entry.overdue > 0 ? `${entry.overdue}d overdue` : "due today"
            }
          />
        )}
      </Section>

      <Section
        label="New"
        count={fresh.length}
        hint={`about ${DAILY_DOSE} a day`}
      >
        {fresh.length === 0 ? (
          <EmptyState>Every problem written up so far has been attempted at least once.</EmptyState>
        ) : (
          <Queue entries={fresh.slice(0, DAILY_DOSE)} trailing={() => "new"} />
        )}
      </Section>

      {shaky.length > 0 ? (
        <section>
          <button
            type="button"
            onClick={() => {
              setShakyOpen((value) => !value);
            }}
            aria-expanded={showShaky}
            className="mb-3 flex w-full items-baseline gap-2 border-b border-line pb-2 text-left"
          >
            <ChevronRight
              size={13}
              strokeWidth={2}
              className={`shrink-0 self-center text-ink-faint transition-transform duration-150 ${
                showShaky ? "rotate-90" : ""
              }`}
            />
            <h2 className="font-mono text-2xs uppercase tracking-wider text-ink-faint">
              Shaky <span className="ml-1 text-ink">{shaky.length}</span>
            </h2>
            <span className="ml-auto font-mono text-2xs text-ink-faint">
              rated 1 or 2, not due yet
            </span>
          </button>

          {showShaky ? (
            <>
              {topCleared ? (
                <p className="mb-3 font-mono text-2xs text-ink-faint">
                  Nothing due and nothing new — this is where the time goes today.
                </p>
              ) : null}
              <Queue
                entries={shaky}
                trailing={(entry) =>
                  entry.progress.rating ? RATING_MEANING[entry.progress.rating] : ""
                }
              />
            </>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
