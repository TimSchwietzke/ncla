import { Suspense, lazy, useMemo } from "react";
import { useParams } from "react-router";
import { MDXProvider } from "@mdx-js/react";
import { findProblem, loadProblemContent } from "../lib/content";
import { useMode } from "../lib/mode";
import { revealNext, useProblemProgress } from "../lib/progress";
import { MDX_COMPONENTS } from "../components/problem/Sections";
import { RevealProvider, STAGES } from "../components/problem/RevealGate";
import { RevealControl } from "../components/problem/RevealControl";
import { DifficultyLabel } from "../components/ui/DifficultyLabel";
import { MetaRail } from "../components/problem/MetaRail";
import NotFound from "./NotFound";

export default function Problem() {
  const { categorySlug = "", problemSlug = "" } = useParams();
  const meta = findProblem(categorySlug, problemSlug);
  const mode = useMode();
  const progress = useProblemProgress(problemSlug);

  const Content = useMemo(() => {
    if (!meta) return null;
    const loader = loadProblemContent(meta);
    return loader ? lazy(loader) : null;
  }, [meta]);

  if (!meta) return <NotFound />;

  const gated = mode === "learn";
  const revealed = gated ? progress.revealed : STAGES.length;

  return (
    <RevealProvider revealed={revealed} gated={gated}>
      <article>
        <header className="mb-8">
          <p className="font-mono text-2xs text-ink-faint">{meta.id}</p>
          <div className="mt-1 flex flex-wrap items-baseline gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{meta.title}</h1>
            <DifficultyLabel difficulty={meta.difficulty} />
            {meta.status === "draft" ? (
              <span className="font-mono text-2xs uppercase text-ink-faint">draft</span>
            ) : null}
          </div>
        </header>

        <div className="flex flex-col gap-8 xl:grid xl:grid-cols-[minmax(0,1fr)_264px] xl:items-start xl:gap-10">
          <div className="order-2 min-w-0 max-w-[72ch] xl:order-1">
            {Content ? (
              <MDXProvider components={MDX_COMPONENTS}>
                <Suspense fallback={<p className="text-sm text-ink-faint">Loading…</p>}>
                  <Content />
                </Suspense>
              </MDXProvider>
            ) : (
              <p className="text-sm text-ink-muted">Content file missing: {meta.file}</p>
            )}

            <RevealControl
              onReveal={() => {
                revealNext(problemSlug, STAGES.length);
              }}
            />
          </div>

          <aside className="order-1 xl:order-2 xl:sticky xl:top-16">
            <MetaRail meta={meta} />
          </aside>
        </div>
      </article>
    </RevealProvider>
  );
}
