import {
  createContext,
  isValidElement,
  useContext,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";

/** Set by <Solution> so a code block can label itself "python · optimal". */
export const SolutionContext = createContext<"brute" | "optimal" | null>(null);

function extractLanguage(children: ReactNode): string | null {
  if (!isValidElement<{ className?: string }>(children)) return null;
  const match = /language-([\w-]+)/.exec(children.props.className ?? "");
  return match?.[1] ?? null;
}

/**
 * Wraps the <pre> that Shiki produces — it must stay a real <pre> with Shiki's own
 * class and inline custom properties, otherwise whitespace and the dark-theme token
 * colours are lost. Inside a solution the block gets editor chrome: a header naming
 * the language and the variant, plus a copy button.
 */
export function CodeBlock({ children, className, style, ...rest }: ComponentProps<"pre">) {
  const variant = useContext(SolutionContext);
  const wrapper = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const language = extractLanguage(children);

  async function copy(): Promise<void> {
    const text = wrapper.current?.querySelector("code")?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      // Clipboard can be blocked; failing silently beats an alert.
    }
  }

  return (
    <div ref={wrapper} className="my-4 overflow-hidden rounded-lg border border-line bg-surface-2">
      {variant ? (
        <div className="flex items-center justify-between border-b border-line px-3 py-1.5">
          <span className="font-mono text-2xs text-ink-faint">
            {language ?? "python"} · {variant === "brute" ? "brute force" : "optimal"}
          </span>
          <button
            type="button"
            onClick={() => {
              void copy();
            }}
            className="font-mono text-2xs text-ink-faint transition-colors hover:text-ink"
          >
            {copied ? "copied" : "copy"}
          </button>
        </div>
      ) : null}
      <pre className={className} style={style} {...rest}>
        {children}
      </pre>
    </div>
  );
}
