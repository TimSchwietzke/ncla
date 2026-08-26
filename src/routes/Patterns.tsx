import { Link } from "react-router";
import { PATTERNS } from "../data/patterns";
import { problemsByPattern } from "../lib/content";
import { PageHeader, Rows } from "../components/ui";

export default function Patterns() {
  return (
    <div className="max-w-[76ch]">
      <PageHeader
        title="Patterns"
        lead="The actual learning target. When you open an unfamiliar problem the first question is not 'what is the solution' but 'which of these is it'."
      />

      <Rows>
        {PATTERNS.map((pattern) => (
          <li key={pattern.slug}>
            <Link
              to={`/patterns/${pattern.slug}`}
              className="flex flex-col gap-1 px-4 py-3 transition-colors hover:bg-surface-2"
            >
              <span className="flex items-baseline gap-3">
                <span className="flex-1 font-medium">{pattern.title}</span>
                <span className="font-mono text-2xs text-ink-faint">
                  {problemsByPattern(pattern.slug).length} problems
                </span>
              </span>
              <span className="text-sm text-ink-muted">{pattern.signal}</span>
              <span className="font-mono text-2xs text-ink-faint">{pattern.slug}</span>
            </Link>
          </li>
        ))}
      </Rows>
    </div>
  );
}
