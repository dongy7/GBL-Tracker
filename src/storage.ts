import type { BattleSet, DayRecord } from "./types";

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
