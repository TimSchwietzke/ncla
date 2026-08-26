import { layoutMarkers } from "./layout";
import type { ArrayStep, CellTone } from "./types";

/**
 * Renders exactly one step as SVG. Stateless — the player owns the frame index.
 * Every array-shaped pattern (sliding window, two pointers, binary search) is the
 * same picture: a row of values, some highlighted, with markers and an optional
 * bracket over a range.
 */

const CELL = 44;
const GAP = 5;
const STRIDE = CELL + GAP;
const PAD = 12;
const CELLS_Y = 26;

/** Slack the span bracket leaves around the cells on every side. */
const SPAN_INSET = 6;
const SPAN_BOTTOM = CELLS_Y + CELL + SPAN_INSET;

/** How far the caret tip reaches above the marker origin, matching its path. */
const CARET_TIP = 10;
/** Clear air between the bottom of the bracket and the tip of the caret. */
const CARET_CLEARANCE = 8;
const MARKERS_Y = SPAN_BOTTOM + CARET_CLEARANCE + CARET_TIP;

/** Label baseline below the caret, which ends at y = -4. */
const MARKER_LABEL_Y = 13;
const HEIGHT = MARKERS_Y + MARKER_LABEL_Y + 4;

interface ToneStyle {
  fill: string;
  stroke: string;
  text: string;
  opacity: number;
}

const TONES: Record<CellTone, ToneStyle> = {
  default: {
    fill: "var(--ncla-surface)",
    stroke: "var(--ncla-line)",
    text: "var(--ncla-ink-faint)",
    opacity: 1,
  },
  active: {
    fill: "var(--ncla-accent-soft)",
    stroke: "var(--ncla-accent)",
    text: "var(--ncla-accent)",
    opacity: 1,
  },
  dim: {
    fill: "var(--ncla-surface)",
    stroke: "var(--ncla-line)",
    text: "var(--ncla-ink-faint)",
    opacity: 0.35,
  },
  found: {
    fill: "var(--ncla-accent)",
    stroke: "var(--ncla-accent)",
    text: "var(--ncla-bg)",
    opacity: 1,
  },
};

export function ArrayTrack({ step, animated = true }: { step: ArrayStep; animated?: boolean }) {
  const width = PAD * 2 + step.values.length * STRIDE - GAP;
  const transition = animated ? "fill 320ms, stroke 320ms, opacity 320ms" : undefined;

  return (
    <svg
      viewBox={`0 0 ${width} ${HEIGHT}`}
      className="w-full"
      role="img"
      aria-label={step.caption}
    >
      {step.values.map((value, index) => {
        const tone = TONES[step.tones[index] ?? "default"];
        return (
          <g
            key={index}
            transform={`translate(${PAD + index * STRIDE}, ${CELLS_Y})`}
            opacity={tone.opacity}
            style={{ transition }}
          >
            <rect
              width={CELL}
              height={CELL}
              rx="5"
              fill={tone.fill}
              stroke={tone.stroke}
              strokeWidth="1"
              style={{ transition }}
            />
            <text
              x={CELL / 2}
              y={CELL / 2 + 5}
              textAnchor="middle"
              fontFamily="var(--font-mono, monospace)"
              fontSize="14"
              fill={tone.text}
              style={{ transition }}
            >
              {value}
            </text>
          </g>
        );
      })}

      {step.span ? (
        <g
          transform={`translate(${PAD + step.span.start * STRIDE}, 0)`}
          style={{
            transition: animated ? "transform 420ms cubic-bezier(0.4, 0, 0.2, 1)" : undefined,
          }}
        >
          <rect
            x="-4"
            y={CELLS_Y - SPAN_INSET}
            width={(step.span.end - step.span.start + 1) * STRIDE - GAP + 8}
            height={CELL + SPAN_INSET * 2}
            rx="8"
            fill="none"
            stroke="var(--ncla-accent)"
            strokeWidth="1.5"
            style={{ transition: animated ? "width 420ms cubic-bezier(0.4, 0, 0.2, 1)" : undefined }}
          />
          {step.span.label ? (
            <text
              x={((step.span.end - step.span.start + 1) * STRIDE - GAP) / 2}
              y={CELLS_Y - 13}
              textAnchor="middle"
              fontFamily="var(--font-mono, monospace)"
              fontSize="11"
              fill="var(--ncla-accent)"
            >
              {step.span.label}
            </text>
          ) : null}
        </g>
      ) : null}

      {layoutMarkers(step.markers).map((marker) => (
        <g
          key={marker.label}
          transform={`translate(${PAD + marker.index * STRIDE + CELL / 2 + marker.offset}, ${MARKERS_Y})`}
          style={{
            transition: animated ? "transform 420ms cubic-bezier(0.4, 0, 0.2, 1)" : undefined,
          }}
        >
          <path d={`M 0 ${-CARET_TIP} L 4 -4 L -4 -4 Z`} fill="var(--ncla-accent)" />
          <text
            textAnchor="middle"
            y={MARKER_LABEL_Y}
            fontFamily="var(--font-mono, monospace)"
            fontSize="11"
            fill="var(--ncla-accent)"
          >
            {marker.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
