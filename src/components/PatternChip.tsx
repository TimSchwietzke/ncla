import { Link } from "react-router";
import { getPattern } from "../data/patterns";

/**
 * Patterns are recognised by their name and their fixed position, not by colour —
 * eighteen hues would be a rainbow, and colour stays reserved for the accent.
 */
export function PatternChip({ slug, linked = true }: { slug: string; linked?: boolean }) {
  const pattern = getPattern(slug);
  const label = pattern?.title ?? slug;

  const className =
    "inline-flex items-center rounded-md border border-line bg-surface-2 px-2 py-0.5 font-mono text-2xs text-ink-muted transition-colors";

  if (!linked) return <span className={className}>{label}</span>;

  return (
    <Link to={`/patterns/${slug}`} className={`${className} hover:border-line-strong hover:text-ink`}>
      {label}
    </Link>
  );
}
