import type { LeagueSchedule } from "../types";
import { LeagueBadge } from "./LeagueBadge";

interface Props {
  leagues: LeagueSchedule[];
}

export function ActiveLeagues({ leagues }: Props) {
  if (leagues.length === 0) {
    return (
      <div className="text-gray-500 text-sm italic">
        No leagues active on this date.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        Available Leagues
      </h3>
      <div className="flex flex-wrap gap-2">
        {leagues.map((l, i) => (
          <LeagueBadge key={i} league={l} />
        ))}
      </div>
    </div>
  );
}
