import { Link } from "react-router";
import { PATTERNS } from "../data/patterns";
import { problemsByPattern } from "../lib/content";
import { PageHeader } from "../components/ui";

export default function Patterns() {
  return (
    <>
      <PageHeader
        title="Patterns"
        lead="The actual learning target. When you open an unfamiliar problem, the first question is not 'what is the solution' but 'which of these is it'."
      />

      <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface">
        {PATTERNS.map((pattern) => (
          <li key={pattern.slug}>
            <Link
              to={`/patterns/${pattern.slug}`}
              className="block px-4 py-3 transition-colors hover:bg-surface-2"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-medium">{pattern.title}</span>
                <span className="shrink-0 text-sm text-muted">
                  {problemsByPattern(pattern.slug).length} problems
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">{pattern.signal}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
