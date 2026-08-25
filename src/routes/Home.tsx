import { Link } from "react-router";
import { CATEGORIES, TOTAL_PROBLEMS } from "../data/categories";
import { PROBLEMS } from "../lib/content";
import { Card, PageHeader } from "../components/ui";

export default function Home() {
  const complete = PROBLEMS.filter((p) => p.status === "complete").length;

  return (
    <>
      <PageHeader
        title="Prepare for the pattern, not for the problem"
        lead="Interviews do not test 150 solutions, they test about 18 patterns. Work through a problem, then be able to reconstruct its one-sentence insight from memory three days later."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-3xl font-semibold">
            {complete}
            <span className="text-lg text-muted">/{TOTAL_PROBLEMS}</span>
          </p>
          <p className="mt-1 text-sm text-muted">problems written up</p>
        </Card>
        <Card>
          <p className="text-3xl font-semibold">18</p>
          <p className="mt-1 text-sm text-muted">patterns to recognise</p>
        </Card>
        <Card>
          <p className="text-3xl font-semibold">3–4</p>
          <p className="mt-1 text-sm text-muted">problems a day, for about seven weeks</p>
        </Card>
      </div>

      <h2 className="mb-3 text-lg font-semibold">Start with the foundation</h2>
      <p className="mb-4 max-w-2xl text-sm text-muted">
        Categories 1–5 carry the techniques every later category reuses. After those, the order is
        yours — leave Advanced Graphs and 2-D DP for last.
      </p>
      <ul className="mb-8 grid gap-3 sm:grid-cols-2">
        {CATEGORIES.filter((c) => c.foundational).map((category) => (
          <li key={category.slug}>
            <Link
              to={`/categories/${category.slug}`}
              className="block rounded-lg border border-line bg-surface p-4 transition-colors hover:border-accent"
            >
              <span className="font-medium">{category.title}</span>
              <span className="ml-2 text-sm text-muted">{category.count} problems</span>
              <p className="mt-1 text-sm text-muted">{category.blurb}</p>
            </Link>
          </li>
        ))}
      </ul>

      <Card>
        <h2 className="font-semibold">Never seen this problem before?</h2>
        <p className="mt-2 text-sm text-muted">
          There is a repeatable way in: read the examples, derive the target complexity from the
          constraints, name the brute force, find its bottleneck, and only then pick a pattern.
        </p>
        <Link to="/method" className="mt-3 inline-block text-sm font-medium text-accent">
          Read the method →
        </Link>
      </Card>
    </>
  );
}
