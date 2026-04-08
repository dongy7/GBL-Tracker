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

  it("includes outgoing leagues on rotation day (1PM PST transition)", () => {
    // March 10 starts Ultra League week, but Great League is still playable until 1PM PST
    const leagues = getAvailableLeagues("2026-03-10");
    const names = leagues.map((l) => l.name);
    expect(names).toContain("Ultra League");
    expect(names).toContain("Spring Cup: Great League Edition");
    // Outgoing leagues that share a name with the current rotation are not duplicated
    expect(names).toContain("Great League");
    expect(names).toContain("Kanto Cup: Great League Edition");
  });

  it("does not include outgoing leagues on the day after rotation", () => {
    const leagues = getAvailableLeagues("2026-03-11");
    const names = leagues.map((l) => l.name);
    expect(names).toContain("Ultra League");
    expect(names).not.toContain("Kanto Cup: Great League Edition");
  });

  it("does not duplicate leagues with the same name across rotations", () => {
    // March 31: Great League ends (Mar 24-31) and starts (Mar 31-Apr 7)
    const leagues = getAvailableLeagues("2026-03-31");
    const names = leagues.map((l) => l.name);
    const greatCount = names.filter((n) => n === "Great League").length;
    expect(greatCount).toBe(1);
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
