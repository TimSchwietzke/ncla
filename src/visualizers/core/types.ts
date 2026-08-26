/**
 * Shared types for every array-shaped visualizer (CLAUDE.md §9).
 *
 * A step is a complete, self-contained frame: the whole visible state plus the
 * highlights. Nothing is incremental, which is what makes stepping backwards free.
 */

export type CellTone =
  /** Ordinary cell. */
  | "default"
  /** Inside the current window or otherwise under consideration. */
  | "active"
  /** Ruled out — outside the remaining search range. */
  | "dim"
  /** Part of the answer. */
  | "found";

export interface Marker {
  index: number;
  /** Short mono label drawn under the cell: "l", "r", "mid". */
  label: string;
}

export interface Span {
  start: number;
  /** Inclusive. */
  end: number;
  /** Small label above the bracket, e.g. "sum 22". */
  label?: string;
}

export interface ArrayStep {
  /** One English sentence: what happens in this step. */
  caption: string;
  /** The full array as it is visible in this frame. */
  values: number[];
  /** One tone per value — same length as `values`. */
  tones: CellTone[];
  markers: Marker[];
  span?: Span;
  /** Mono status line, e.g. "best 22 at index 4". */
  readout?: string;
}
