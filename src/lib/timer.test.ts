import { beforeEach, describe, expect, it } from "vitest";
import {
  TARGET_SECONDS,
  elapsedSeconds,
  formatDuration,
  isRunning,
  pauseTimer,
  resetTimer,
  seedTimer,
  startTimer,
} from "./timer";

describe("formatDuration", () => {
  it("pads to mm:ss", () => {
    expect(formatDuration(0)).toBe("00:00");
    expect(formatDuration(9)).toBe("00:09");
    expect(formatDuration(65)).toBe("01:05");
    expect(formatDuration(TARGET_SECONDS)).toBe("20:00");
  });

  it("keeps counting past the target instead of wrapping", () => {
    expect(formatDuration(TARGET_SECONDS + 61)).toBe("21:01");
    expect(formatDuration(3600)).toBe("60:00");
  });
});

describe("the attempt timer", () => {
  beforeEach(() => {
    resetTimer("two-sum");
  });

  it("starts at zero and is not running until started", () => {
    expect(elapsedSeconds()).toBe(0);
    expect(isRunning()).toBe(false);
  });

  it("banks time when paused and resumes from there", () => {
    seedTimer("two-sum", 90);
    expect(elapsedSeconds()).toBe(90);
    startTimer("two-sum");
    expect(isRunning()).toBe(true);
    pauseTimer();
    expect(isRunning()).toBe(false);
    // Still 90 or a hair more; the banked time is not lost by pausing.
    expect(elapsedSeconds()).toBeGreaterThanOrEqual(90);
  });

  it("crosses the twenty-minute mark exactly where the display turns", () => {
    seedTimer("two-sum", TARGET_SECONDS - 1);
    expect(elapsedSeconds() >= TARGET_SECONDS).toBe(false);
    seedTimer("two-sum", TARGET_SECONDS);
    expect(elapsedSeconds() >= TARGET_SECONDS).toBe(true);
  });

  it("starts a fresh attempt when a different problem is opened", () => {
    seedTimer("two-sum", 300);
    startTimer("daily-temperatures");
    expect(elapsedSeconds()).toBeLessThan(2);
  });

  it("keeps the banked time when the same problem is resumed", () => {
    seedTimer("two-sum", 300);
    startTimer("two-sum");
    expect(elapsedSeconds()).toBeGreaterThanOrEqual(300);
  });
});
