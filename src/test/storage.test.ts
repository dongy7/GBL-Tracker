import { describe, it, expect, beforeEach } from "vitest";
import {
  loadAllData,
  loadDay,
  saveDay,
  loadPreviousDayRating,
  createBattleSet,
  loadTeams,
  saveTeams,
  exportData,
  importData,
} from "../storage";
import type { DayRecord, SavedTeam } from "../types";

beforeEach(() => {
  localStorage.clear();
});

describe("day records", () => {
  it("returns empty object when no data", () => {
    expect(loadAllData()).toEqual({});
  });

  it("returns null for nonexistent day", () => {
    expect(loadDay("2026-03-05")).toBeNull();
  });

  it("saves and loads a day record", () => {
    const record: DayRecord = { date: "2026-03-05", sets: [] };
    saveDay(record);
    expect(loadDay("2026-03-05")).toEqual(record);
  });

  it("preserves other days when saving", () => {
    saveDay({ date: "2026-03-05", sets: [] });
    saveDay({ date: "2026-03-06", sets: [] });
    expect(loadDay("2026-03-05")).not.toBeNull();
    expect(loadDay("2026-03-06")).not.toBeNull();
  });
});

describe("createBattleSet", () => {
  it("creates a set with 5 battles", () => {
    const set = createBattleSet("2026-03-05", 1, "Great League");
    expect(set.battles).toHaveLength(5);
    expect(set.setNumber).toBe(1);
    expect(set.date).toBe("2026-03-05");
  });

  it("sets all battles to the given league", () => {
    const set = createBattleSet("2026-03-05", 1, "Ultra League");
    set.battles.forEach((b) => {
      expect(b.league).toBe("Ultra League");
      expect(b.result).toBeNull();
      expect(b.myTeam).toEqual(["", "", ""]);
      expect(b.opponentTeam).toEqual(["", "", ""]);
    });
  });
});

describe("loadPreviousDayRating", () => {
  it("returns null when no previous data", () => {
    expect(loadPreviousDayRating("2026-03-05")).toBeNull();
  });

  it("returns start rating from previous day", () => {
    saveDay({
      date: "2026-03-04",
      sets: [],
      startRating: { type: "elo", value: 2100 },
    });
    expect(loadPreviousDayRating("2026-03-05")).toEqual({
      type: "elo",
      value: 2100,
    });
  });

  it("returns end rating from last set over start rating", () => {
    const set = createBattleSet("2026-03-04", 1, "Great League");
    set.endRating = { type: "elo", value: 2200 };
    saveDay({
      date: "2026-03-04",
      sets: [set],
      startRating: { type: "elo", value: 2100 },
    });
    expect(loadPreviousDayRating("2026-03-05")).toEqual({
      type: "elo",
      value: 2200,
    });
  });

  it("skips future dates", () => {
    saveDay({
      date: "2026-03-06",
      sets: [],
      startRating: { type: "elo", value: 2500 },
    });
    expect(loadPreviousDayRating("2026-03-05")).toBeNull();
  });
});

describe("teams", () => {
  it("returns empty array when no teams", () => {
    expect(loadTeams()).toEqual([]);
  });

  it("saves and loads teams", () => {
    const teams: SavedTeam[] = [
      { id: "1", name: "Test", pokemon: ["Bulbasaur", "Charmander", "Squirtle"], leagues: ["Great League"] },
    ];
    saveTeams(teams);
    expect(loadTeams()).toEqual(teams);
  });
});

describe("export/import", () => {
  it("exports tracker and teams data", () => {
    saveDay({ date: "2026-03-05", sets: [] });
    saveTeams([{ id: "1", name: "Test", pokemon: ["A", "B", "C"], leagues: ["Great League"] }]);
    const exported = JSON.parse(exportData());
    expect(exported.tracker).toBeDefined();
    expect(exported.teams).toBeDefined();
    expect(exported.tracker["2026-03-05"]).toBeDefined();
    expect(exported.teams).toHaveLength(1);
  });

  it("imports new format with tracker and teams", () => {
    const data = {
      tracker: { "2026-03-05": { date: "2026-03-05", sets: [] } },
      teams: [{ id: "1", name: "Test", pokemon: ["A", "B", "C"], leagues: ["Great League"] }],
    };
    importData(JSON.stringify(data));
    expect(loadDay("2026-03-05")).not.toBeNull();
    expect(loadTeams()).toHaveLength(1);
  });

  it("imports legacy format (tracker only)", () => {
    const data = { "2026-03-05": { date: "2026-03-05", sets: [] } };
    importData(JSON.stringify(data));
    expect(loadDay("2026-03-05")).not.toBeNull();
  });

  it("throws on invalid JSON", () => {
    expect(() => importData("not json")).toThrow();
  });
});
