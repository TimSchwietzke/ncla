import { describe, expect, it } from "vitest";
import { MARKER_SPREAD, layoutMarkers } from "./layout";
import { buildSteps as binarySearch } from "../binary-search/steps";

describe("layoutMarkers", () => {
  it("leaves a lone marker on the cell centre", () => {
    expect(layoutMarkers([{ index: 3, label: "mid" }])).toEqual([
      { index: 3, label: "mid", offset: 0 },
    ]);
  });

  it("spreads two markers sharing a cell symmetrically", () => {
    const placed = layoutMarkers([
      { index: 5, label: "lo" },
      { index: 5, label: "mid" },
    ]);
    expect(placed.map((marker) => marker.offset)).toEqual([-MARKER_SPREAD / 2, MARKER_SPREAD / 2]);
  });

  it("spreads three markers sharing a cell around the centre", () => {
    const placed = layoutMarkers([
      { index: 2, label: "lo" },
      { index: 2, label: "mid" },
      { index: 2, label: "hi" },
    ]);
    expect(placed.map((marker) => marker.offset)).toEqual([-MARKER_SPREAD, 0, MARKER_SPREAD]);
  });

  it("does not shift markers that sit on different cells", () => {
    const placed = layoutMarkers([
      { index: 0, label: "l" },
      { index: 7, label: "r" },
    ]);
    expect(placed.every((marker) => marker.offset === 0)).toBe(true);
  });

  it("keeps every marker of a real binary search visually apart", () => {
    // lo and mid land on the same cell as soon as the range is down to two.
    const steps = binarySearch({ values: [2, 3, 5, 8, 11, 15, 17, 20, 24, 29], target: 17 });
    const collided = steps.filter((step) => {
      const indices = step.markers.map((marker) => marker.index);
      return new Set(indices).size !== indices.length;
    });
    expect(collided.length).toBeGreaterThan(0);

    for (const step of steps) {
      const positions = layoutMarkers(step.markers).map(
        (marker) => marker.index * 49 + marker.offset,
      );
      expect(new Set(positions).size).toBe(positions.length);
    }
  });
});
