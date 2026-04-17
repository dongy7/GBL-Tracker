import { useState, useCallback } from "react";
import type { BattleSet, DayRecord, Rating } from "../types";
import { loadDay, loadPreviousDayRating, canBankFromPreviousDay, saveDay, createBattleSet } from "../storage";
import { getMaxSets, getAvailableLeagues } from "../leagues";

function loadOrCreate(date: string): DayRecord {
  return loadDay(date) ?? { date, sets: [] };
}

export function useDay(date: string) {
  const [state, setState] = useState(() => ({
    date,
    record: loadOrCreate(date),
  }));

  // If the date prop changed, reset synchronously during render
  let dayRecord = state.record;
  if (state.date !== date) {
    dayRecord = loadOrCreate(date);
    setState({ date, record: dayRecord });
  }

  const persist = useCallback(
    (updated: DayRecord) => {
      setState((s) => ({ ...s, record: updated }));
      saveDay(updated);
    },
    []
  );

  const toggleBankedSet = useCallback(() => {
    persist({ ...dayRecord, bankedSet: !dayRecord.bankedSet });
  }, [dayRecord, persist]);

  const addSet = useCallback(() => {
    const maxSets = getMaxSets(date) + (dayRecord.bankedSet ? 1 : 0);
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
      const renumbered = filtered.map((s, i) => ({
        ...s,
        setNumber: i + 1,
        id: `${date}-set-${i + 1}`,
      }));
      persist({ ...dayRecord, sets: renumbered });
    },
    [date, dayRecord, persist]
  );

  const setStartRating = useCallback(
    (rating: Rating) => {
      persist({ ...dayRecord, startRating: rating });
    },
    [dayRecord, persist]
  );

  const previousDayRating = loadPreviousDayRating(date);
  const canBank = canBankFromPreviousDay();

  const maxSets = getMaxSets(date) + (dayRecord.bankedSet ? 1 : 0);
  const canAddSet = dayRecord.sets.length < maxSets;

  return { dayRecord, addSet, updateSet, deleteSet, canAddSet, maxSets, setStartRating, previousDayRating, toggleBankedSet, canBank };
}
