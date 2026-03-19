import type { LeagueSchedule } from "./types";

export const SEASON_NAME = "Memories in Motion";
export const SEASON_START = "2026-03-03";
export const SEASON_END = "2026-06-02";

export const LEAGUE_SCHEDULES: LeagueSchedule[] = [
  // March 3-10
  { name: "Great League", startDate: "2026-03-03", endDate: "2026-03-10", cpLimit: 1500, typeRestriction: null, banned: [], eligible: null, stardustBonus: false },
  { name: "Kanto Cup: GL Edition", startDate: "2026-03-03", endDate: "2026-03-10", cpLimit: 1500, typeRestriction: null, banned: [], eligible: "Pokédex #001–#151 only", stardustBonus: false },

  // March 10-17
  { name: "Ultra League", startDate: "2026-03-10", endDate: "2026-03-17", cpLimit: 2500, typeRestriction: null, banned: [], eligible: null, stardustBonus: false },
  { name: "Spring Cup: GL Edition", startDate: "2026-03-10", endDate: "2026-03-17", cpLimit: 1500, typeRestriction: "Water, Grass, Fairy", banned: ["Jumpluff", "Roserade", "Toxapex"], eligible: null, stardustBonus: false },

  // March 17-24
  { name: "Master League", startDate: "2026-03-17", endDate: "2026-03-24", cpLimit: null, typeRestriction: null, banned: [], eligible: null, stardustBonus: true },
  { name: "Jungle Cup: GL Edition", startDate: "2026-03-17", endDate: "2026-03-24", cpLimit: 1500, typeRestriction: "Normal, Grass, Electric, Poison, Ground, Flying, Bug, Dark", banned: [], eligible: null, stardustBonus: true },

  // March 24-31
  { name: "Great League", startDate: "2026-03-24", endDate: "2026-03-31", cpLimit: 1500, typeRestriction: null, banned: [], eligible: null, stardustBonus: true },
  { name: "Ultra League", startDate: "2026-03-24", endDate: "2026-03-31", cpLimit: 2500, typeRestriction: null, banned: [], eligible: null, stardustBonus: true },
  { name: "Master League", startDate: "2026-03-24", endDate: "2026-03-31", cpLimit: null, typeRestriction: null, banned: [], eligible: null, stardustBonus: true },

  // March 31 - April 7
  { name: "Great League", startDate: "2026-03-31", endDate: "2026-04-07", cpLimit: 1500, typeRestriction: null, banned: [], eligible: null, stardustBonus: false },
  { name: "Electric Cup: GL Edition", startDate: "2026-03-31", endDate: "2026-04-07", cpLimit: 1500, typeRestriction: "Electric", banned: ["Stunfisk", "Heliolisk", "Charjabug", "Vikavolt"], eligible: null, stardustBonus: false },

  // April 7-14
  { name: "Ultra League", startDate: "2026-04-07", endDate: "2026-04-14", cpLimit: 2500, typeRestriction: null, banned: [], eligible: null, stardustBonus: false },
  { name: "Fantasy Cup: GL Edition", startDate: "2026-04-07", endDate: "2026-04-14", cpLimit: 1500, typeRestriction: "Dragon, Steel, Fairy", banned: [], eligible: null, stardustBonus: false },

  // April 14-21
  { name: "Master League", startDate: "2026-04-14", endDate: "2026-04-21", cpLimit: null, typeRestriction: null, banned: [], eligible: null, stardustBonus: true },
  { name: "Spring Cup: GL Edition", startDate: "2026-04-14", endDate: "2026-04-21", cpLimit: 1500, typeRestriction: "Water, Grass, Fairy", banned: ["Jumpluff", "Roserade", "Toxapex"], eligible: null, stardustBonus: true },

  // April 21-28
  { name: "Great League", startDate: "2026-04-21", endDate: "2026-04-28", cpLimit: 1500, typeRestriction: null, banned: [], eligible: null, stardustBonus: true },
  { name: "Ultra League", startDate: "2026-04-21", endDate: "2026-04-28", cpLimit: 2500, typeRestriction: null, banned: [], eligible: null, stardustBonus: true },
  { name: "Master League", startDate: "2026-04-21", endDate: "2026-04-28", cpLimit: null, typeRestriction: null, banned: [], eligible: null, stardustBonus: true },

  // April 28 - May 5
  { name: "Great League", startDate: "2026-04-28", endDate: "2026-05-05", cpLimit: 1500, typeRestriction: null, banned: [], eligible: null, stardustBonus: false },
  { name: "Fantasy Cup: GL Edition", startDate: "2026-04-28", endDate: "2026-05-05", cpLimit: 1500, typeRestriction: "Dragon, Steel, Fairy", banned: [], eligible: null, stardustBonus: false },

  // May 5-12
  { name: "Ultra League", startDate: "2026-05-05", endDate: "2026-05-12", cpLimit: 2500, typeRestriction: null, banned: [], eligible: null, stardustBonus: false },
  { name: "Jungle Cup: GL Edition", startDate: "2026-05-05", endDate: "2026-05-12", cpLimit: 1500, typeRestriction: "Normal, Grass, Electric, Poison, Ground, Flying, Bug, Dark", banned: [], eligible: null, stardustBonus: false },

  // May 12-19
  { name: "Master League", startDate: "2026-05-12", endDate: "2026-05-19", cpLimit: null, typeRestriction: null, banned: [], eligible: null, stardustBonus: true },
  { name: "Catch Cup: Memories in Motion GL", startDate: "2026-05-12", endDate: "2026-05-19", cpLimit: 1500, typeRestriction: null, banned: [], eligible: "Caught during Memories in Motion season only", stardustBonus: true },

  // May 19-26
  { name: "Great League", startDate: "2026-05-19", endDate: "2026-05-26", cpLimit: 1500, typeRestriction: null, banned: [], eligible: null, stardustBonus: true },
  { name: "Ultra League", startDate: "2026-05-19", endDate: "2026-05-26", cpLimit: 2500, typeRestriction: null, banned: [], eligible: null, stardustBonus: true },
  { name: "Master League", startDate: "2026-05-19", endDate: "2026-05-26", cpLimit: null, typeRestriction: null, banned: [], eligible: null, stardustBonus: true },

  // May 26 - June 2
  { name: "Great League", startDate: "2026-05-26", endDate: "2026-06-02", cpLimit: 1500, typeRestriction: null, banned: [], eligible: null, stardustBonus: true },
  { name: "Ultra League", startDate: "2026-05-26", endDate: "2026-06-02", cpLimit: 2500, typeRestriction: null, banned: [], eligible: null, stardustBonus: true },
  { name: "Master League", startDate: "2026-05-26", endDate: "2026-06-02", cpLimit: null, typeRestriction: null, banned: [], eligible: null, stardustBonus: true },
];

export function getAvailableLeagues(date: string): LeagueSchedule[] {
  return LEAGUE_SCHEDULES.filter(
    (l) => date >= l.startDate && date < l.endDate
  );
}

export function isThursday(date: string): boolean {
  return new Date(date + "T12:00:00").getDay() === 4;
}

export function getMaxSets(date: string): number {
  return isThursday(date) ? 10 : 5;
}
