export interface Battle {
  id: string;
  won: boolean | null; // null = not yet recorded
  league: string;
  myTeam: [string, string, string];
  opponentTeam: [string, string, string];
}

export interface BattleSet {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  setNumber: number; // 1-5 (or 1-10 on Thursdays)
  battles: Battle[];
}

export interface DayRecord {
  date: string;
  sets: BattleSet[];
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
