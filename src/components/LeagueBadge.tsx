import type { LeagueSchedule } from "../types";
import { LEAGUE_SCHEDULES } from "../leagues";

const LEAGUE_COLORS: Record<string, string> = {
  "Great League": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "Ultra League": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  "Master League": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
};

// eslint-disable-next-line react-refresh/only-export-components
export function getLeagueColor(name: string): string {
  for (const [key, val] of Object.entries(LEAGUE_COLORS)) {
    if (name.includes(key.split(" ")[0])) return val;
  }
  return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
}

// eslint-disable-next-line react-refresh/only-export-components
export function getLeagueIcon(name: string): string | undefined {
  return LEAGUE_SCHEDULES.find((l) => l.name === name)?.icon;
}

interface Props {
  league: LeagueSchedule;
}

export function LeagueBadge({ league }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getLeagueColor(league.name)}`}
      title={[
        league.cpLimit ? `CP ≤ ${league.cpLimit}` : "No CP limit",
        league.typeRestriction && `Types: ${league.typeRestriction}`,
        league.banned.length > 0 && `Banned: ${league.banned.join(", ")}`,
        league.eligible,
      ]
        .filter(Boolean)
        .join(" | ")}
    >
      <img src={league.icon} alt="" className="w-4 h-4" />
      {league.name}
      {league.stardustBonus && <span title="4× Stardust">✦</span>}
    </span>
  );
}

interface NameBadgeProps {
  name: string;
  selected?: boolean;
  onClick?: () => void;
}

export function LeagueNameBadge({ name, selected, onClick }: NameBadgeProps) {
  const icon = getLeagueIcon(name);
  const colorClass = selected
    ? "bg-blue-500 text-white border-blue-500"
    : getLeagueColor(name);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border transition-colors ${
        selected ? colorClass : `${colorClass} border-transparent`
      }`}
    >
      {icon && <img src={icon} alt="" className="w-3.5 h-3.5" />}
      {name}
    </button>
  );
}
