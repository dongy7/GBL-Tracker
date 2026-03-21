import type { DayRecord, Rating } from "../types";
import { formatRating } from "../rating";

interface Props {
  dayRecord: DayRecord;
  startRating?: Rating;
}

export function DaySummary({ dayRecord, startRating }: Props) {
  if (dayRecord.sets.length === 0) return null;

  const allBattles = dayRecord.sets.flatMap((s) => s.battles);
  const totalWins = allBattles.filter((b) => b.result === "win").length;
  const totalLosses = allBattles.filter((b) => b.result === "loss").length;
  const totalDraws = allBattles.filter((b) => b.result === "draw").length;
  const total = totalWins + totalLosses + totalDraws;

  // Per-league breakdown
  const byLeague = new Map<string, { w: number; l: number; d: number }>();
  for (const b of allBattles) {
    if (b.result === null) continue;
    const entry = byLeague.get(b.league) ?? { w: 0, l: 0, d: 0 };
    if (b.result === "win") entry.w++;
    else if (b.result === "loss") entry.l++;
    else entry.d++;
    byLeague.set(b.league, entry);
  }

  // ELO change: from start rating to last set's end rating
  const lastEndRating = [...dayRecord.sets].reverse().find((s) => s.endRating)?.endRating;
  let eloDelta: number | null = null;
  if (
    startRating?.type === "elo" &&
    lastEndRating?.type === "elo"
  ) {
    eloDelta = lastEndRating.value - startRating.value;
  }

  if (total === 0) return null;

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-3">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        Daily Summary
      </h3>
      <div className="flex items-center gap-6 flex-wrap">
        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          <span className="text-green-600 dark:text-green-400">{totalWins}W</span>
          {" - "}
          <span className="text-red-600 dark:text-red-400">{totalLosses}L</span>
          {totalDraws > 0 && (
            <>
              {" - "}
              <span className="text-yellow-600 dark:text-yellow-400">{totalDraws}D</span>
            </>
          )}
        </div>
        <div className="text-sm text-gray-500">
          {total > 0 && `${Math.round((totalWins / total) * 100)}% win rate`}
        </div>
        {eloDelta !== null && (
          <div className={`text-sm font-semibold ${
            eloDelta > 0
              ? "text-green-600 dark:text-green-400"
              : eloDelta < 0
                ? "text-red-600 dark:text-red-400"
                : "text-gray-500"
          }`}>
            ELO: {eloDelta > 0 ? `+${eloDelta}` : eloDelta}
            {lastEndRating && (
              <span className="text-gray-400 font-normal ml-1">
                ({formatRating(lastEndRating)})
              </span>
            )}
          </div>
        )}
        {/* Win rate bar */}
        <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex min-w-20">
          <div
            className="h-full bg-green-500 transition-all"
            style={{ width: `${total > 0 ? (totalWins / total) * 100 : 0}%` }}
          />
          {totalDraws > 0 && (
            <div
              className="h-full bg-yellow-400 transition-all"
              style={{ width: `${(totalDraws / total) * 100}%` }}
            />
          )}
        </div>
      </div>

      {byLeague.size > 1 && (
        <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
          {[...byLeague.entries()].map(([league, { w, l, d }]) => (
            <span key={league}>
              {league}: {w}W-{l}L{d > 0 ? `-${d}D` : ""}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
