import type { LeagueSchedule } from "./types";

export const SEASON_NAME = "Memories in Motion";
export const SEASON_START = "2026-03-03";
export const SEASON_END = "2026-06-02";

const ICONS = {
  great: "https://lh3.googleusercontent.com/Hgk6QkWUrAhjCXsFJW5WB9Q-dXfP4NcBfo_YVCgJ-7ba9UOvRmA1AQ5dEffKfHg08SBWQ9d8q9y-h0UCRzVJ9WBVCaPqjJVm9DQU2DmvTXm5iw=s0-e365",
  ultra: "https://lh3.googleusercontent.com/QRlL4u97DNh1aLsVR7QsUW8QfpMZpLYTnmLzVsVvY67k0CB82H3KWrgPr2L1fq1vxccU03fDFrNmHkVDzJAEwwBJ6xLOcvVtMZr7wSFdSuMePg=s0-e365",
  master: "https://lh3.googleusercontent.com/QtzKglb_31f_XozFiyaDzd3hBdZoSe8HDJ0901Jk6sNEqB920hqaiRNhnBL0ieyp-7wccca6KXjm52fTttVexcEHnhRDRf6DtdD55FpNfufdMA=s0-e365",
  kanto: "https://lh3.googleusercontent.com/hsf25XV15PtzqJA_4_N1MZsUcijmXSnmyZzAbrtq9JMxIHkDtBieEF_kV5GBbjiB0i02WTINvAye6O29qqfkibaBtvQ8fchphkY=s0-e365",
  spring: "https://lh3.googleusercontent.com/dbypUPCcvMZB_HEv58qDwX915uN5NWwJnaPsbHiItkWk4Rgnbiig1dXrSLZHL80upFc4ubnWA6asqI9w9oiB0FDV8tz8SZYwgpb2=s0-e365",
  jungle: "https://lh3.googleusercontent.com/zu5WzS7dAd3GTUSosliLYpinIWEtS_DuDTk7J5FGaV9ueUfClC_ZnaQBBZe_RiwqEMxgMAeYNaUrxTGJqZ55GTIqeZ7fbvSRp14=s0-e365",
  electric: "https://lh3.googleusercontent.com/1pMPCj4BGfmMG4r0ZV65TvgFhumT1bvN_G7AU6NY5Jdzl9H0uQ32U8uPg7EMYgA7GHhg8V5L66tVswde_ZAwqj4OpedcFdnxN2k=s0-e365",
  fantasy: "https://lh3.googleusercontent.com/-iI4G9-RtK7w48TtZRL1u-xzNwTtaWj6iY0GepeZRFWj5gS2L9XjqGpugfwKWKHnTUv1vYi2LmiUXNNRjkH61V3gNA3AfQt7jt00=s0-e365",
  catch: "https://lh3.googleusercontent.com/tn5cdJ4ubmTt3ZKaNnLj1EK9Ksuk-wDOhiV9lMQSnNVfN3bNwhk8PUvlb5Jk2751pz0wmim0O4KRKucMG9S12idX1ONsmHowQzk=s0-e365",
};

export const LEAGUE_SCHEDULES: LeagueSchedule[] = [
  // March 3-10
  { name: "Great League", icon: ICONS.great, startDate: "2026-03-03", endDate: "2026-03-10", cpLimit: 1500, typeRestriction: null, banned: [], eligible: null, stardustBonus: false },
  { name: "Kanto Cup: Great League Edition", icon: ICONS.kanto, startDate: "2026-03-03", endDate: "2026-03-10", cpLimit: 1500, typeRestriction: null, banned: [], eligible: "Pokédex #001–#151 only", stardustBonus: false },

  // March 10-17
  { name: "Ultra League", icon: ICONS.ultra, startDate: "2026-03-10", endDate: "2026-03-17", cpLimit: 2500, typeRestriction: null, banned: [], eligible: null, stardustBonus: false },
  { name: "Spring Cup: Great League Edition", icon: ICONS.spring, startDate: "2026-03-10", endDate: "2026-03-17", cpLimit: 1500, typeRestriction: "Water, Grass, Fairy", banned: ["Jumpluff", "Roserade", "Toxapex"], eligible: null, stardustBonus: false },

  // March 17-24
  { name: "Master League", icon: ICONS.master, startDate: "2026-03-17", endDate: "2026-03-24", cpLimit: null, typeRestriction: null, banned: [], eligible: null, stardustBonus: true },
  { name: "Jungle Cup: Great League Edition", icon: ICONS.jungle, startDate: "2026-03-17", endDate: "2026-03-24", cpLimit: 1500, typeRestriction: "Normal, Grass, Electric, Poison, Ground, Flying, Bug, Dark", banned: [], eligible: null, stardustBonus: true },

  // March 24-31
  { name: "Great League", icon: ICONS.great, startDate: "2026-03-24", endDate: "2026-03-31", cpLimit: 1500, typeRestriction: null, banned: [], eligible: null, stardustBonus: true },
  { name: "Ultra League", icon: ICONS.ultra, startDate: "2026-03-24", endDate: "2026-03-31", cpLimit: 2500, typeRestriction: null, banned: [], eligible: null, stardustBonus: true },
  { name: "Master League", icon: ICONS.master, startDate: "2026-03-24", endDate: "2026-03-31", cpLimit: null, typeRestriction: null, banned: [], eligible: null, stardustBonus: true },

  // March 31 - April 7
  { name: "Great League", icon: ICONS.great, startDate: "2026-03-31", endDate: "2026-04-07", cpLimit: 1500, typeRestriction: null, banned: [], eligible: null, stardustBonus: false },
  { name: "Electric Cup: Great League Edition", icon: ICONS.electric, startDate: "2026-03-31", endDate: "2026-04-07", cpLimit: 1500, typeRestriction: "Electric", banned: ["Stunfisk", "Heliolisk", "Charjabug", "Vikavolt"], eligible: null, stardustBonus: false },

  // April 7-14
  { name: "Ultra League", icon: ICONS.ultra, startDate: "2026-04-07", endDate: "2026-04-14", cpLimit: 2500, typeRestriction: null, banned: [], eligible: null, stardustBonus: false },
  { name: "Fantasy Cup: Great League Edition", icon: ICONS.fantasy, startDate: "2026-04-07", endDate: "2026-04-14", cpLimit: 1500, typeRestriction: "Dragon, Steel, Fairy", banned: [], eligible: null, stardustBonus: false },

  // April 14-21
  { name: "Master League", icon: ICONS.master, startDate: "2026-04-14", endDate: "2026-04-21", cpLimit: null, typeRestriction: null, banned: [], eligible: null, stardustBonus: true },
  { name: "Spring Cup: Great League Edition", icon: ICONS.spring, startDate: "2026-04-14", endDate: "2026-04-21", cpLimit: 1500, typeRestriction: "Water, Grass, Fairy", banned: ["Jumpluff", "Roserade", "Toxapex"], eligible: null, stardustBonus: true },

  // April 21-28
  { name: "Great League", icon: ICONS.great, startDate: "2026-04-21", endDate: "2026-04-28", cpLimit: 1500, typeRestriction: null, banned: [], eligible: null, stardustBonus: true },
  { name: "Ultra League", icon: ICONS.ultra, startDate: "2026-04-21", endDate: "2026-04-28", cpLimit: 2500, typeRestriction: null, banned: [], eligible: null, stardustBonus: true },
  { name: "Master League", icon: ICONS.master, startDate: "2026-04-21", endDate: "2026-04-28", cpLimit: null, typeRestriction: null, banned: [], eligible: null, stardustBonus: true },

  // April 28 - May 5
  { name: "Great League", icon: ICONS.great, startDate: "2026-04-28", endDate: "2026-05-05", cpLimit: 1500, typeRestriction: null, banned: [], eligible: null, stardustBonus: false },
  { name: "Fantasy Cup: Great League Edition", icon: ICONS.fantasy, startDate: "2026-04-28", endDate: "2026-05-05", cpLimit: 1500, typeRestriction: "Dragon, Steel, Fairy", banned: [], eligible: null, stardustBonus: false },

  // May 5-12
  { name: "Ultra League", icon: ICONS.ultra, startDate: "2026-05-05", endDate: "2026-05-12", cpLimit: 2500, typeRestriction: null, banned: [], eligible: null, stardustBonus: false },
  { name: "Jungle Cup: Great League Edition", icon: ICONS.jungle, startDate: "2026-05-05", endDate: "2026-05-12", cpLimit: 1500, typeRestriction: "Normal, Grass, Electric, Poison, Ground, Flying, Bug, Dark", banned: [], eligible: null, stardustBonus: false },

  // May 12-19
  { name: "Master League", icon: ICONS.master, startDate: "2026-05-12", endDate: "2026-05-19", cpLimit: null, typeRestriction: null, banned: [], eligible: null, stardustBonus: true },
  { name: "Catch Cup: Memories in Motion: Great League Edition", icon: ICONS.catch, startDate: "2026-05-12", endDate: "2026-05-19", cpLimit: 1500, typeRestriction: null, banned: [], eligible: "Caught during Memories in Motion season only", stardustBonus: true },

  // May 19-26
  { name: "Great League", icon: ICONS.great, startDate: "2026-05-19", endDate: "2026-05-26", cpLimit: 1500, typeRestriction: null, banned: [], eligible: null, stardustBonus: true },
  { name: "Ultra League", icon: ICONS.ultra, startDate: "2026-05-19", endDate: "2026-05-26", cpLimit: 2500, typeRestriction: null, banned: [], eligible: null, stardustBonus: true },
  { name: "Master League", icon: ICONS.master, startDate: "2026-05-19", endDate: "2026-05-26", cpLimit: null, typeRestriction: null, banned: [], eligible: null, stardustBonus: true },

  // May 26 - June 2
  { name: "Great League", icon: ICONS.great, startDate: "2026-05-26", endDate: "2026-06-02", cpLimit: 1500, typeRestriction: null, banned: [], eligible: null, stardustBonus: true },
  { name: "Ultra League", icon: ICONS.ultra, startDate: "2026-05-26", endDate: "2026-06-02", cpLimit: 2500, typeRestriction: null, banned: [], eligible: null, stardustBonus: true },
  { name: "Master League", icon: ICONS.master, startDate: "2026-05-26", endDate: "2026-06-02", cpLimit: null, typeRestriction: null, banned: [], eligible: null, stardustBonus: true },
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
