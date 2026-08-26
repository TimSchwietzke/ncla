import { useEffect, useState } from "react";

/**
 * The hero graphic: a sliding window of width four walking across an array, with the
 * running sum and the best seen so far. It is the simplest pattern in the list and it
 * explains itself in one loop — which is exactly the promise of the app.
 *
 * Frames are precomputed, the same way every real visualizer will work (CLAUDE.md §9).
 */
const VALUES = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8];
const WINDOW = 4;

const CELL = 48;
const GAP = 5;
const STRIDE = CELL + GAP;
const PAD = 10;

interface Frame {
  start: number;
  sum: number;
  best: number;
  bestStart: number;
}

function buildFrames(): Frame[] {
  const frames: Frame[] = [];
  let best = -Infinity;
  let bestStart = 0;

  for (let start = 0; start + WINDOW <= VALUES.length; start += 1) {
    const sum = VALUES.slice(start, start + WINDOW).reduce((a, b) => a + b, 0);
    if (sum > best) {
      best = sum;
      bestStart = start;
    }
    frames.push({ start, sum, best, bestStart });
  }
  return frames;
}

const FRAMES = buildFrames();

export function HeroWindow() {
  const [index, setIndex] = useState(0);
  const [animated, setAnimated] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAnimated(false);
      setIndex(FRAMES.length - 1);
      return;
    }
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % FRAMES.length);
    }, 1100);
    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const frame = FRAMES[index] ?? FRAMES[0];
  if (!frame) return null;

  const width = PAD * 2 + VALUES.length * STRIDE - GAP;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} 96`}
        className="w-full"
        role="img"
        aria-label={`A sliding window of four cells moving across an array. Current sum ${frame.sum}, best so far ${frame.best}.`}
      >
        <g>
          {VALUES.map((value, i) => {
            const inside = i >= frame.start && i < frame.start + WINDOW;
            return (
              <g key={i} transform={`translate(${PAD + i * STRIDE}, 24)`}>
                <rect
                  width={CELL}
                  height={CELL}
                  rx="5"
                  fill={inside ? "var(--ncla-accent-soft)" : "var(--ncla-surface)"}
                  stroke={inside ? "var(--ncla-accent)" : "var(--ncla-line)"}
                  strokeWidth="1"
                  style={{ transition: animated ? "fill 350ms, stroke 350ms" : undefined }}
                />
                <text
                  x={CELL / 2}
                  y={CELL / 2 + 5}
                  textAnchor="middle"
                  fontFamily="var(--font-mono, monospace)"
                  fontSize="15"
                  fill={inside ? "var(--ncla-accent)" : "var(--ncla-ink-faint)"}
                  style={{ transition: animated ? "fill 350ms" : undefined }}
                >
                  {value}
                </text>
              </g>
            );
          })}
        </g>

        <g
          transform={`translate(${PAD + frame.start * STRIDE}, 0)`}
          style={{ transition: animated ? "transform 450ms cubic-bezier(0.4, 0, 0.2, 1)" : undefined }}
        >
          <rect
            x="-4"
            y="18"
            width={WINDOW * STRIDE - GAP + 8}
            height={CELL + 12}
            rx="8"
            fill="none"
            stroke="var(--ncla-accent)"
            strokeWidth="1.5"
          />
          <text
            x={(WINDOW * STRIDE - GAP) / 2}
            y="12"
            textAnchor="middle"
            fontFamily="var(--font-mono, monospace)"
            fontSize="11"
            fill="var(--ncla-accent)"
          >
            sum {frame.sum}
          </text>
        </g>
      </svg>

      <p className="mt-3 text-center font-mono text-2xs text-ink-faint">
        sliding window · k = {WINDOW} · best so far{" "}
        <span className="text-ink">{frame.best}</span> at index {frame.bestStart}
      </p>
    </div>
  );
}
