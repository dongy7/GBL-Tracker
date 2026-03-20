import type { BattleSet, DayRecord, Rating, SavedTeam } from "./types";

const STORAGE_KEY = "pogo-gbl-tracker";
const TEAMS_KEY = "pogo-gbl-teams";

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

// Teams
export function loadTeams(): SavedTeam[] {
  const raw = localStorage.getItem(TEAMS_KEY);
  if (!raw) return [];
  return JSON.parse(raw);
}

export function saveTeams(teams: SavedTeam[]): void {
  localStorage.setItem(TEAMS_KEY, JSON.stringify(teams));
}

// Export/Import
export function exportData(): string {
  const tracker = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  const teams = JSON.parse(localStorage.getItem(TEAMS_KEY) ?? "[]");
  return JSON.stringify({ tracker, teams });
}

export function importData(json: string): void {
  const parsed = JSON.parse(json);
  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("Invalid data format");
  }
  // Support new format { tracker, teams } and legacy format (just tracker data)
  if ("tracker" in parsed) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed.tracker));
    if (parsed.teams) {
      localStorage.setItem(TEAMS_KEY, JSON.stringify(parsed.teams));
    }
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  }
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
      result: null,
      league,
      myTeam: ["", "", ""],
      opponentTeam: ["", "", ""],
    })),
  };
}
