import { Link, useParams } from "react-router";
import { getCategory } from "../data/categories";
import { getPattern } from "../data/patterns";
import { problemsByPattern } from "../lib/content";
import { Card, DifficultyBadge, MilestoneNote, PageHeader } from "../components/ui";
import NotFound from "./NotFound";

export default function PatternDetail() {
  const { patternSlug = "" } = useParams();
  const pattern = getPattern(patternSlug);
  if (!pattern) return <NotFound />;

  const problems = problemsByPattern(pattern.slug);

  return (
    <>
      <PageHeader title={pattern.title} lead={pattern.signal} />

      <div className="mb-8">
        {pattern.hasVisualizer ? null : (
          <MilestoneNote milestone="M3">
            The step-by-step visualizer for this pattern — play, single step forward and back, your
            own input — is built in the visualizer slice.
          </MilestoneNote>
        )}
      </div>

      <Card className="mb-8">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">
          Shows up in
        </h2>
        <p className="mt-2 text-sm">
          {pattern.categories.map((slug, index) => (
            <span key={slug}>
              {index > 0 ? ", " : ""}
              <Link to={`/categories/${slug}`} className="text-accent">
                {getCategory(slug)?.title ?? slug}
              </Link>
            </span>
          ))}
        </p>
      </Card>

      <h2 className="mb-3 text-lg font-semibold">Problems using this pattern</h2>
      {problems.length === 0 ? (
        <p className="text-sm text-muted">No problems written up for this pattern yet.</p>
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface">
          {problems.map((problem) => (
            <li key={problem.slug}>
              <Link
                to={`/problems/${problem.category}/${problem.slug}`}
                className="flex items-baseline gap-3 px-4 py-3 transition-colors hover:bg-surface-2"
              >
                <span className="w-10 shrink-0 text-sm text-muted">{problem.id}</span>
                <span className="flex-1 font-medium">{problem.title}</span>
                <DifficultyBadge difficulty={problem.difficulty} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
