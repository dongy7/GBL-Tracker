import type { BattleSet, DayRecord, Rating } from "./types";

const STORAGE_KEY = "pogo-gbl-tracker";

export function loadAllData(): Record<string, DayRecord> {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  return JSON.parse(raw);
}

export function loadDay(date: string): DayRecord | null {
  const all = loadAllData();
  return all[date] ?? null;
}

export function saveDay(record: DayRecord): void {
  const all = loadAllData();
  all[record.date] = record;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function loadPreviousDayRating(date: string): Rating | null {
  const all = loadAllData();
  // Find the most recent day before this date that has rating data
  const previousDates = Object.keys(all)
    .filter((d) => d < date)
    .sort()
    .reverse();

  for (const d of previousDates) {
    const record = all[d];
    // Check last set's end rating first
    for (let i = record.sets.length - 1; i >= 0; i--) {
      if (record.sets[i].endRating) return record.sets[i].endRating!;
    }
    // Fall back to start rating
    if (record.startRating) return record.startRating;
  }
  return null;
}

export function createBattleSet(
  date: string,
  setNumber: number,
  league: string
): BattleSet {
  return {
    id: `${date}-set-${setNumber}`,
    date,
    setNumber,
    battles: Array.from({ length: 5 }, (_, i) => ({
      id: `${date}-set-${setNumber}-battle-${i + 1}`,
      won: null,
      league,
      myTeam: ["", "", ""],
      opponentTeam: ["", "", ""],
    })),
  };
}
