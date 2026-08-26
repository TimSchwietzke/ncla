import { Link, useParams } from "react-router";
import { getCategory } from "../data/categories";
import { getPattern } from "../data/patterns";
import { problemsByPattern } from "../lib/content";
import { DifficultyLabel } from "../components/DifficultyLabel";
import { EmptyState, Eyebrow, MilestoneNote, PageHeader, Rows } from "../components/ui";
import NotFound from "./NotFound";

export default function PatternDetail() {
  const { patternSlug = "" } = useParams();
  const pattern = getPattern(patternSlug);
  if (!pattern) return <NotFound />;

  const problems = problemsByPattern(pattern.slug);

  return (
    <div className="max-w-[76ch]">
      <PageHeader title={pattern.title} lead={pattern.signal} />

      {pattern.hasVisualizer ? null : (
        <div className="mb-10">
          <MilestoneNote milestone="M3">
            The step-by-step visualizer for this pattern — play, single step forward and back, your
            own input — is built in the visualizer slice.
          </MilestoneNote>
        </div>
      )}

      <section className="mb-10">
        <Eyebrow>Shows up in</Eyebrow>
        <p className="mt-2 text-sm">
          {pattern.categories.map((slug, index) => (
            <span key={slug}>
              {index > 0 ? <span className="text-ink-faint"> · </span> : null}
              <Link to={`/categories/${slug}`} className="text-accent hover:underline">
                {getCategory(slug)?.title ?? slug}
              </Link>
            </span>
          ))}
        </p>
      </section>

      <section>
        <Eyebrow>Problems using this pattern</Eyebrow>
        <div className="mt-2">
          {problems.length === 0 ? (
            <EmptyState>No problems written up for this pattern yet.</EmptyState>
          ) : (
            <Rows>
              {problems.map((problem) => (
                <li key={problem.slug}>
                  <Link
                    to={`/problems/${problem.category}/${problem.slug}`}
                    className="flex items-baseline gap-3 px-4 py-2.5 transition-colors hover:bg-surface-2"
                  >
                    <span className="w-8 shrink-0 font-mono text-2xs text-ink-faint">
                      {problem.id}
                    </span>
                    <span className="flex-1 truncate">{problem.title}</span>
                    <DifficultyLabel difficulty={problem.difficulty} />
                  </Link>
                </li>
              ))}
            </Rows>
          )}
        </div>
      </section>
    </div>
  );
}
