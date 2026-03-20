import { useState, useCallback } from "react";
import type { SavedTeam } from "../types";
import { loadTeams, saveTeams } from "../storage";

export function useTeams() {
  const [teams, setTeams] = useState<SavedTeam[]>(loadTeams);

  const persist = useCallback((updated: SavedTeam[]) => {
    setTeams(updated);
    saveTeams(updated);
  }, []);

  const addTeam = useCallback(
    (team: Omit<SavedTeam, "id">) => {
      const newTeam: SavedTeam = { ...team, id: crypto.randomUUID() };
      persist([...teams, newTeam]);
    },
    [teams, persist]
  );

  const updateTeam = useCallback(
    (id: string, patch: Partial<SavedTeam>) => {
      persist(teams.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    },
    [teams, persist]
  );

  const deleteTeam = useCallback(
    (id: string) => {
      persist(teams.filter((t) => t.id !== id));
    },
    [teams, persist]
  );

  const getTeamsForLeagues = useCallback(
    (leagueNames: string[]): SavedTeam[] => {
      return teams.filter((t) =>
        t.leagues.some((l) => leagueNames.includes(l))
      );
    },
    [teams]
  );

  return { teams, addTeam, updateTeam, deleteTeam, getTeamsForLeagues };
}
