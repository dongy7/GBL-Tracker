import { describe, it, expect } from "vitest";
import { tierForElo, effectiveTier, makeEloRating, formatRating, ratingDelta } from "../rating";
import type { Rating } from "../types";

describe("tierForElo", () => {
  it("returns undefined below 2000", () => {
    expect(tierForElo(1999)).toBeUndefined();
  });

  it("returns Ace at 2000", () => {
    expect(tierForElo(2000)).toBe("Ace");
  });

  it("returns Veteran at 2500", () => {
    expect(tierForElo(2500)).toBe("Veteran");
  });

  it("returns Expert at 2750", () => {
    expect(tierForElo(2750)).toBe("Expert");
  });

  it("returns Legend at 3000", () => {
    expect(tierForElo(3000)).toBe("Legend");
  });

  it("returns Ace between 2000-2499", () => {
    expect(tierForElo(2300)).toBe("Ace");
  });
});

describe("effectiveTier", () => {
  it("returns stored tier when current ELO drops below threshold", () => {
    const rating: Rating = { type: "elo", value: 1900, tier: "Ace" };
    expect(effectiveTier(rating)).toBe("Ace");
  });

  it("returns higher tier when ELO rises above stored tier", () => {
    const rating: Rating = { type: "elo", value: 2600, tier: "Ace" };
    expect(effectiveTier(rating)).toBe("Veteran");
  });

  it("returns undefined for rank type", () => {
    const rating: Rating = { type: "rank", value: 15 };
    expect(effectiveTier(rating)).toBeUndefined();
  });

  it("preserves Legend even at low ELO", () => {
    const rating: Rating = { type: "elo", value: 1500, tier: "Legend" };
    expect(effectiveTier(rating)).toBe("Legend");
  });
});

describe("makeEloRating", () => {
  it("creates rating with tier from current ELO", () => {
    const rating = makeEloRating(2100);
    expect(rating.tier).toBe("Ace");
  });

  it("preserves previous tier when ELO drops", () => {
    const rating = makeEloRating(1900, "Veteran");
    expect(rating.tier).toBe("Veteran");
  });

  it("upgrades tier when ELO rises above previous tier", () => {
    const rating = makeEloRating(3100, "Ace");
    expect(rating.tier).toBe("Legend");
  });
});

describe("formatRating", () => {
  it("formats rank", () => {
    expect(formatRating({ type: "rank", value: 15 })).toBe("Rank 15");
  });

  it("formats ELO without tier", () => {
    expect(formatRating({ type: "elo", value: 1800 })).toBe("1800");
  });

  it("formats ELO with tier", () => {
    expect(formatRating({ type: "elo", value: 2100 })).toBe("Ace (2100)");
  });

  it("formats ELO with stored tier when below threshold", () => {
    expect(formatRating({ type: "elo", value: 1900, tier: "Ace" })).toBe("Ace (1900)");
  });
});

describe("ratingDelta", () => {
  it("calculates positive ELO delta", () => {
    const before: Rating = { type: "elo", value: 2000 };
    const after: Rating = { type: "elo", value: 2050 };
    expect(ratingDelta(before, after)).toBe("+50");
  });

  it("calculates negative ELO delta", () => {
    const before: Rating = { type: "elo", value: 2000 };
    const after: Rating = { type: "elo", value: 1950 };
    expect(ratingDelta(before, after)).toBe("-50");
  });

  it("shows rank change", () => {
    const before: Rating = { type: "rank", value: 10 };
    const after: Rating = { type: "rank", value: 11 };
    expect(ratingDelta(before, after)).toBe("Rank 10 → 11");
  });

  it("shows rank to ELO transition", () => {
    const before: Rating = { type: "rank", value: 20 };
    const after: Rating = { type: "elo", value: 2000 };
    expect(ratingDelta(before, after)).toBe("Rank 20 → 2000 ELO");
  });

  it("returns null for same rank", () => {
    const before: Rating = { type: "rank", value: 10 };
    const after: Rating = { type: "rank", value: 10 };
    expect(ratingDelta(before, after)).toBeNull();
  });
});
