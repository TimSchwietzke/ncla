import { describe, expect, it } from "vitest";
import {
  BASE_INTERVAL_DAYS,
  MAX_INTERVAL_DAYS,
  addDays,
  isDue,
  maturity,
  overdueDays,
  previewInterval,
  schedule,
  toISODate,
} from "./srs";

const MONDAY = new Date(2026, 8, 7); // 7 September 2026, local time

describe("date helpers", () => {
  it("formats a local calendar date", () => {
    expect(toISODate(new Date(2026, 0, 5))).toBe("2026-01-05");
    expect(toISODate(new Date(2026, 11, 31))).toBe("2026-12-31");
  });

  it("crosses month and year boundaries", () => {
    expect(addDays("2026-01-30", 3)).toBe("2026-02-02");
    expect(addDays("2026-12-30", 7)).toBe("2027-01-06");
    expect(addDays("2028-02-28", 1)).toBe("2028-02-29"); // leap year
    expect(addDays("2026-03-05", -7)).toBe("2026-02-26");
  });

  it("counts overdue days in whole days, either direction", () => {
    expect(overdueDays("2026-09-07", "2026-09-07")).toBe(0);
    expect(overdueDays("2026-09-03", "2026-09-07")).toBe(4);
    expect(overdueDays("2026-09-10", "2026-09-07")).toBe(-3);
    expect(overdueDays(undefined, "2026-09-07")).toBe(0);
  });

  it("treats today as due but tomorrow as not", () => {
    expect(isDue("2026-09-07", "2026-09-07")).toBe(true);
    expect(isDue("2026-09-01", "2026-09-07")).toBe(true);
    expect(isDue("2026-09-08", "2026-09-07")).toBe(false);
    expect(isDue(undefined, "2026-09-07")).toBe(false);
  });
});

describe("schedule", () => {
  it("sends a failure back to the start and clears the streak", () => {
    const after = schedule({ streak: 5, intervalDays: 60 }, 1, MONDAY);
    expect(after).toEqual({ streak: 0, intervalDays: 1, dueOn: "2026-09-08" });
  });

  it("gives a two-day pause when the insight was needed", () => {
    expect(schedule({ streak: 3, intervalDays: 30 }, 2, MONDAY)).toEqual({
      streak: 0,
      intervalDays: 2,
      dueOn: "2026-09-09",
    });
  });

  it("uses the base interval on the first success", () => {
    for (const rating of [3, 4, 5] as const) {
      const result = schedule(undefined, rating, MONDAY);
      expect(result.streak).toBe(1);
      expect(result.intervalDays).toBe(BASE_INTERVAL_DAYS[rating]);
    }
  });

  it("grows by a factor that depends on the rating, from the second success", () => {
    // 14 days banked, then one more clean run.
    expect(schedule({ streak: 1, intervalDays: 14 }, 5, MONDAY).intervalDays).toBe(39); // ×2.8
    expect(schedule({ streak: 1, intervalDays: 14 }, 4, MONDAY).intervalDays).toBe(31); // ×2.2
    expect(schedule({ streak: 1, intervalDays: 14 }, 3, MONDAY).intervalDays).toBe(22); // ×1.6
  });

  it("caps at ninety days", () => {
    expect(schedule({ streak: 4, intervalDays: 40 }, 5, MONDAY).intervalDays).toBe(
      MAX_INTERVAL_DAYS,
    );
    expect(schedule({ streak: 9, intervalDays: 90 }, 5, MONDAY).intervalDays).toBe(
      MAX_INTERVAL_DAYS,
    );
  });

  it("falls back to the base interval if a streak exists without an interval", () => {
    expect(schedule({ streak: 2, intervalDays: 0 }, 4, MONDAY).intervalDays).toBe(7);
  });

  it("sets the due date the interval away from today", () => {
    expect(schedule(undefined, 5, MONDAY).dueOn).toBe("2026-09-21");
    expect(schedule(undefined, 3, new Date(2026, 11, 30)).dueOn).toBe("2027-01-02");
  });

  it("walks a realistic streak upwards and a failure back down", () => {
    let s = schedule(undefined, 4, MONDAY); //   7
    expect(s.intervalDays).toBe(7);
    s = schedule(s, 4, MONDAY); //              15
    expect(s.intervalDays).toBe(15);
    s = schedule(s, 5, MONDAY); //              42
    expect(s.intervalDays).toBe(42);
    expect(s.streak).toBe(3);
    s = schedule(s, 1, MONDAY); //     back to  1
    expect(s).toMatchObject({ streak: 0, intervalDays: 1 });
  });
});

describe("previewInterval", () => {
  it("matches what committing that rating would do", () => {
    const previous = { streak: 2, intervalDays: 10 };
    for (const rating of [1, 2, 3, 4, 5] as const) {
      expect(previewInterval(previous, rating)).toBe(schedule(previous, rating).intervalDays);
    }
  });
});

describe("maturity", () => {
  it("separates untouched, learning and stuck-for-good", () => {
    expect(maturity(undefined)).toBe("new");
    expect(maturity(0)).toBe("new");
    expect(maturity(20)).toBe("learning");
    expect(maturity(21)).toBe("mature");
    expect(maturity(90)).toBe("mature");
  });
});
