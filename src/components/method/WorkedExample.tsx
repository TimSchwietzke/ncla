import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { METHOD_STEPS } from "../../data/method";

/**
 * The same six steps, filled in for Two Sum. Deliberately the identical shape as the
 * empty procedure above it — seeing the form twice, blank and answered, is what makes
 * it stick.
 *
 * It ends with a link rather than the solution code: the full write-up is one click
 * away, and a second copy of the code here would only drift from it.
 */
export function WorkedExample() {
  return (
    <div>
      <ol className="border-l border-line">
        {METHOD_STEPS.map((step) => (
          <li key={step.id} className="relative pb-5 pl-5 last:pb-0">
            <div className="flex items-baseline gap-3">
              <span className="shrink-0 font-mono text-2xs text-ink-faint">{step.id}</span>
              <span className="text-sm font-medium text-ink-muted">{step.title}</span>
            </div>
            <p className="mt-1 ml-[2.1rem] max-w-[62ch] text-ink">{step.example}</p>
          </li>
        ))}
      </ol>

      <Link
        to="/problems/arrays-hashing/two-sum"
        className="mt-5 ml-5 inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
      >
        The full write-up, with both solutions
        <ArrowRight size={14} strokeWidth={2} />
      </Link>
    </div>
  );
}
