export type EloTier = "Ace" | "Veteran" | "Legend";

export interface Rating {
  type: "rank" | "elo";
  value: number; // rank 1-20 or ELO rating
  tier?: EloTier; // highest tier achieved — never demotes
}

export type BattleResult = "win" | "loss" | "draw" | null;

export interface Battle {
  id: string;
  result: BattleResult; // null = not yet recorded
  league: string;
  myTeam: [string, string, string];
  opponentTeam: [string, string, string];
  opponentId?: string;
}

export interface BattleSet {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  setNumber: number; // 1-5 (or 1-10 on Thursdays)
  battles: Battle[];
  endRating?: Rating; // rating after completing this set
}

export interface DayRecord {
  date: string;
  sets: BattleSet[];
  startRating?: Rating; // rating at the start of the day
}

export interface LeagueSchedule {
  name: string;
  icon: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  cpLimit: number | null; // null = no limit (Master League)
  typeRestriction: string | null;
  banned: string[];
  eligible: string | null; // e.g. "Kanto only"
  stardustBonus: boolean;
}
