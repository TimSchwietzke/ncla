import { Suspense, lazy, useMemo } from "react";
import { Link, useParams } from "react-router";
import { MDXProvider } from "@mdx-js/react";
import { getCategory } from "../data/categories";
import { getPattern } from "../data/patterns";
import { findProblem, loadProblemContent } from "../lib/content";
import { MDX_COMPONENTS } from "../components/mdx/Sections";
import { DifficultyBadge, MilestoneNote } from "../components/ui";
import NotFound from "./NotFound";

export default function Problem() {
  const { categorySlug = "", problemSlug = "" } = useParams();
  const meta = findProblem(categorySlug, problemSlug);

  const Content = useMemo(() => {
    if (!meta) return null;
    const loader = loadProblemContent(meta);
    return loader ? lazy(loader) : null;
  }, [meta]);

  if (!meta) return <NotFound />;
  const category = getCategory(meta.category);

  return (
    <>
      <nav className="mb-4 text-sm text-muted">
        <Link to={`/categories/${meta.category}`} className="text-accent">
          {category?.title ?? meta.category}
        </Link>
        <span className="mx-2">/</span>
        <span>{meta.id}</span>
      </nav>

      <header className="mb-6">
        <div className="flex flex-wrap items-baseline gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">{meta.title}</h1>
          <DifficultyBadge difficulty={meta.difficulty} />
          {meta.premium ? (
            <span className="text-xs uppercase tracking-wide text-muted">premium</span>
          ) : null}
        </div>

        <dl className="mt-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
          <div className="flex gap-2">
            <dt className="text-muted">Target</dt>
            <dd className="font-mono">
              {meta.targetComplexity.time} time, {meta.targetComplexity.space} space
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-muted">Patterns</dt>
            <dd>
              {meta.patterns.map((slug, index) => (
                <span key={slug}>
                  {index > 0 ? ", " : ""}
                  <Link to={`/patterns/${slug}`} className="text-accent">
                    {getPattern(slug)?.title ?? slug}
                  </Link>
                </span>
              ))}
            </dd>
          </div>
          {meta.prerequisites.length > 0 ? (
            <div className="flex gap-2 sm:col-span-2">
              <dt className="text-muted">Assumes</dt>
              <dd>{meta.prerequisites.join(" · ")}</dd>
            </div>
          ) : null}
          <div className="flex gap-2 sm:col-span-2">
            <dt className="text-muted">On LeetCode</dt>
            <dd>
              <a href={meta.url} target="_blank" rel="noreferrer" className="text-accent">
                LC {meta.leetcode} ↗
              </a>
            </dd>
          </div>
        </dl>
      </header>

      <div className="mb-6">
        <MilestoneNote milestone="M2">
          Everything is shown at once for now. The staged reveal — target complexity, then pattern
          hint, then insight, then approach, then code — plus the 20 minute timer arrive with the
          learn mode slice.
        </MilestoneNote>
      </div>

      {Content ? (
        <MDXProvider components={MDX_COMPONENTS}>
          <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
            <Content />
          </Suspense>
        </MDXProvider>
      ) : (
        <p className="text-sm text-muted">Content file missing: {meta.file}</p>
      )}
    </>
  );
}
