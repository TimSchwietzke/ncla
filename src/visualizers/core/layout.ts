import type { Marker } from "./types";

/** Horizontal distance between two markers that share a cell. */
export const MARKER_SPREAD = 24;

export interface PlacedMarker extends Marker {
  /** Pixels to shift from the cell centre so co-located markers stay readable. */
  offset: number;
}

/**
 * Markers regularly collide: binary search puts `lo` and `mid` on the same cell as
 * soon as the range is down to two, and all three land together at one. Stacking them
 * at the identical x makes them illegible, so co-located markers are spread evenly
 * around the cell centre while keeping their order.
 */
export function layoutMarkers(markers: Marker[]): PlacedMarker[] {
  const counts = new Map<number, number>();
  for (const marker of markers) {
    counts.set(marker.index, (counts.get(marker.index) ?? 0) + 1);
  }

  const seen = new Map<number, number>();
  return markers.map((marker) => {
    const total = counts.get(marker.index) ?? 1;
    const position = seen.get(marker.index) ?? 0;
    seen.set(marker.index, position + 1);
    return {
      ...marker,
      offset: total === 1 ? 0 : (position - (total - 1) / 2) * MARKER_SPREAD,
    };
  });
}
