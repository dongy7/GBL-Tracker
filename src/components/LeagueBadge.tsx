import type { LeagueSchedule } from "../types";

const LEAGUE_COLORS: Record<string, string> = {
  "Great League": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "Ultra League": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  "Master League": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
};

function getColor(name: string): string {
  for (const [key, val] of Object.entries(LEAGUE_COLORS)) {
    if (name.includes(key.split(" ")[0])) return val;
  }
  return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
}

interface Props {
  league: LeagueSchedule;
}

export function LeagueBadge({ league }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getColor(league.name)}`}
      title={[
        league.cpLimit ? `CP ≤ ${league.cpLimit}` : "No CP limit",
        league.typeRestriction && `Types: ${league.typeRestriction}`,
        league.banned.length > 0 && `Banned: ${league.banned.join(", ")}`,
        league.eligible,
      ]
        .filter(Boolean)
        .join(" | ")}
    >
      {league.name}
      {league.stardustBonus && <span title="4× Stardust">✦</span>}
    </span>
  );
}
