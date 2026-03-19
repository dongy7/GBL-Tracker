import type { DayRecord } from "../types";

interface Props {
  dayRecord: DayRecord;
}

export function DaySummary({ dayRecord }: Props) {
  if (dayRecord.sets.length === 0) return null;

  const allBattles = dayRecord.sets.flatMap((s) => s.battles);
  const totalWins = allBattles.filter((b) => b.won === true).length;
  const totalLosses = allBattles.filter((b) => b.won === false).length;
  const total = totalWins + totalLosses;

  // Per-league breakdown
  const byLeague = new Map<string, { w: number; l: number }>();
  for (const b of allBattles) {
    if (b.won === null) continue;
    const entry = byLeague.get(b.league) ?? { w: 0, l: 0 };
    if (b.won) entry.w++;
    else entry.l++;
    byLeague.set(b.league, entry);
  }

  if (total === 0) return null;

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-3">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        Daily Summary
      </h3>
      <div className="flex items-center gap-6">
        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          <span className="text-green-600 dark:text-green-400">{totalWins}W</span>
          {" - "}
          <span className="text-red-600 dark:text-red-400">{totalLosses}L</span>
        </div>
        <div className="text-sm text-gray-500">
          {total > 0 && `${Math.round((totalWins / total) * 100)}% win rate`}
        </div>
        {/* Win rate bar */}
        <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all"
            style={{ width: `${total > 0 ? (totalWins / total) * 100 : 0}%` }}
          />
        </div>
      </div>

      {byLeague.size > 1 && (
        <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
          {[...byLeague.entries()].map(([league, { w, l }]) => (
            <span key={league}>
              {league}: {w}W-{l}L
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
