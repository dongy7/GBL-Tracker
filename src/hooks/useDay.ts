import { useState, useCallback, useEffect } from "react";
import type { BattleSet, DayRecord } from "../types";
import { loadDay, saveDay, createBattleSet } from "../storage";
import { getMaxSets, getAvailableLeagues } from "../leagues";

export function useDay(date: string) {
  const [dayRecord, setDayRecord] = useState<DayRecord>(() => {
    const existing = loadDay(date);
    if (existing) return existing;
    return { date, sets: [] };
  });

  // Reload when date changes
  useEffect(() => {
    const existing = loadDay(date);
    setDayRecord(existing ?? { date, sets: [] });
  }, [date]);

  const persist = useCallback(
    (updated: DayRecord) => {
      setDayRecord(updated);
      saveDay(updated);
    },
    []
  );

  const addSet = useCallback(() => {
    const maxSets = getMaxSets(date);
    if (dayRecord.sets.length >= maxSets) return;
    const leagues = getAvailableLeagues(date);
    const defaultLeague = leagues[0]?.name ?? "Great League";
    const newSet = createBattleSet(
      date,
      dayRecord.sets.length + 1,
      defaultLeague
    );
    persist({ ...dayRecord, sets: [...dayRecord.sets, newSet] });
  }, [date, dayRecord, persist]);

  const updateSet = useCallback(
    (setId: string, updater: (s: BattleSet) => BattleSet) => {
      const updated = {
        ...dayRecord,
        sets: dayRecord.sets.map((s) => (s.id === setId ? updater(s) : s)),
      };
      persist(updated);
    },
    [dayRecord, persist]
  );

  const deleteSet = useCallback(
    (setId: string) => {
      const filtered = dayRecord.sets.filter((s) => s.id !== setId);
      // Renumber
      const renumbered = filtered.map((s, i) => ({
        ...s,
        setNumber: i + 1,
        id: `${date}-set-${i + 1}`,
      }));
      persist({ ...dayRecord, sets: renumbered });
    },
    [date, dayRecord, persist]
  );

  const maxSets = getMaxSets(date);
  const canAddSet = dayRecord.sets.length < maxSets;

  return { dayRecord, addSet, updateSet, deleteSet, canAddSet, maxSets };
}
