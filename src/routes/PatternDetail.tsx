import { useState } from "react";
import { Link, useParams } from "react-router";
import { getCategory } from "../data/categories";
import { getPattern } from "../data/patterns";
import { problemsByPattern } from "../lib/content";
import { DifficultyLabel } from "../components/ui/DifficultyLabel";
import { EmptyState, Eyebrow, MilestoneNote, PageHeader, Rows } from "../components/ui/primitives";
import { StepPlayer } from "../visualizers/core/StepPlayer";
import { ArrayTrack } from "../visualizers/core/ArrayTrack";
import { getVisualizer } from "../visualizers/registry";
import NotFound from "./NotFound";

export default function PatternDetail() {
  const { patternSlug = "" } = useParams();
  const pattern = getPattern(patternSlug);
  if (!pattern) return <NotFound />;

  const problems = problemsByPattern(pattern.slug);
  const entry = getVisualizer(pattern.slug);
  const presetNames = Object.keys(entry?.presets ?? {});
  const [preset, setPreset] = useState(entry?.defaultPreset ?? "");
  const chosen = entry?.presets[preset] ?? entry?.presets[entry.defaultPreset];

  return (
    <div className="max-w-[76ch]">
      <PageHeader title={pattern.title} lead={pattern.signal} />

      {chosen ? (
        <section className="mb-10">
          {presetNames.length > 1 ? (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {presetNames.map((name) => {
                const active = name === preset;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      setPreset(name);
                    }}
                    aria-pressed={active}
                    className={`rounded-md border px-2.5 py-1 font-mono text-2xs transition-colors ${
                      active
                        ? "border-accent bg-accent-soft text-accent"
                        : "border-line text-ink-faint hover:border-line-strong hover:text-ink"
                    }`}
                  >
                    {entry?.presets[name]?.label ?? name}
                  </button>
                );
              })}
            </div>
          ) : null}
          <StepPlayer
            key={preset}
            steps={chosen.build()}
            render={(step, animated) => <ArrayTrack step={step} animated={animated} />}
          />
        </section>
      ) : (
        <div className="mb-10">
          <MilestoneNote milestone="M3">
            The step-by-step player for this pattern is still to come — it arrives with the first
            problems that use it.
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
