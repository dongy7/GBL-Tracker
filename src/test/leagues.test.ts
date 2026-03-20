import { describe, it, expect } from "vitest";
import { getAvailableLeagues, isThursday, getMaxSets } from "../leagues";

describe("getAvailableLeagues", () => {
  it("returns leagues for a date within the season", () => {
    const leagues = getAvailableLeagues("2026-03-05");
    expect(leagues.length).toBeGreaterThan(0);
    const names = leagues.map((l) => l.name);
    expect(names).toContain("Great League");
    expect(names).toContain("Kanto Cup: Great League Edition");
  });

  it("returns empty for a date outside the season", () => {
    expect(getAvailableLeagues("2025-01-01")).toEqual([]);
  });

  it("returns multiple leagues during all-league weeks", () => {
    const leagues = getAvailableLeagues("2026-03-25");
    const names = leagues.map((l) => l.name);
    expect(names).toContain("Great League");
    expect(names).toContain("Ultra League");
    expect(names).toContain("Master League");
  });

  it("does not include leagues from adjacent weeks", () => {
    // March 10 starts Ultra League week, Great League ends
    const leagues = getAvailableLeagues("2026-03-10");
    const names = leagues.map((l) => l.name);
    expect(names).toContain("Ultra League");
    expect(names).not.toContain("Great League");
  });
});

describe("isThursday", () => {
  it("returns true for a Thursday", () => {
    // 2026-03-05 is a Thursday
    expect(isThursday("2026-03-05")).toBe(true);
  });

  it("returns false for a non-Thursday", () => {
    // 2026-03-06 is a Friday
    expect(isThursday("2026-03-06")).toBe(false);
  });
});

describe("getMaxSets", () => {
  it("returns 10 on Thursdays", () => {
    expect(getMaxSets("2026-03-05")).toBe(10);
  });

  it("returns 5 on other days", () => {
    expect(getMaxSets("2026-03-06")).toBe(5);
  });
});
