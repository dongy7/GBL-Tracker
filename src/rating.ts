import type { Rating, EloTier } from "./types";

const TIER_THRESHOLDS: { tier: EloTier; elo: number }[] = [
  { tier: "Legend", elo: 3000 },
  { tier: "Expert", elo: 2750 },
  { tier: "Veteran", elo: 2500 },
  { tier: "Ace", elo: 2000 },
];

const TIER_RANK: Record<EloTier, number> = {
  Ace: 1,
  Veteran: 2,
  Expert: 3,
  Legend: 4,
};

/** Get the tier earned at a given ELO (ignoring history). */
export function tierForElo(elo: number): EloTier | undefined {
  for (const { tier, elo: threshold } of TIER_THRESHOLDS) {
    if (elo >= threshold) return tier;
  }
  return undefined;
}

/**
 * Resolve the effective tier for a rating, considering that tiers
 * never demote. Takes the higher of the current ELO tier and the
 * previously stored tier.
 */
export function effectiveTier(rating: Rating): EloTier | undefined {
  if (rating.type !== "elo") return undefined;
  const current = tierForElo(rating.value);
  const stored = rating.tier;
  if (!current) return stored;
  if (!stored) return current;
  return TIER_RANK[current] >= TIER_RANK[stored] ? current : stored;
}

/**
 * Build a new Rating, carrying forward the highest tier ever reached.
 * `previousTier` is the tier from the rating before this one.
 */
export function makeEloRating(elo: number, previousTier?: EloTier): Rating {
  const earned = tierForElo(elo);
  let best: EloTier | undefined;
  if (!earned) best = previousTier;
  else if (!previousTier) best = earned;
  else best = TIER_RANK[earned] >= TIER_RANK[previousTier] ? earned : previousTier;
  return { type: "elo", value: elo, tier: best };
}

export function formatRating(rating: Rating): string {
  if (rating.type === "rank") {
    return `Rank ${rating.value}`;
  }
  const tier = effectiveTier(rating);
  return tier ? `${tier} (${rating.value})` : `${rating.value}`;
}

export function ratingDelta(before: Rating, after: Rating): string | null {
  if (before.type === "elo" && after.type === "elo") {
    const diff = after.value - before.value;
    return diff >= 0 ? `+${diff}` : `${diff}`;
  }
  if (before.type === "rank" && after.type === "rank" && after.value !== before.value) {
    return `Rank ${before.value} → ${after.value}`;
  }
  if (before.type === "rank" && after.type === "elo") {
    return `Rank 20 → ${after.value} ELO`;
  }
  return null;
}
