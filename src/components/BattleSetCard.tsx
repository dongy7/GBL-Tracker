import { useState } from "react";
import type { BattleSet, Battle, Rating, SavedTeam } from "../types";
import type { LeagueSchedule } from "../types";
import { TeamInput } from "./TeamInput";
import { SetRatingInput } from "./SetRatingInput";


interface Props {
  battleSet: BattleSet;
  availableLeagues: LeagueSchedule[];
  savedTeams?: SavedTeam[];
  beforeRating?: Rating;
  onUpdate: (updater: (s: BattleSet) => BattleSet) => void;
  onDelete: () => void;
}

export function BattleSetCard({ battleSet, availableLeagues, savedTeams = [], beforeRating, onUpdate, onDelete }: Props) {
  const wins = battleSet.battles.filter((b) => b.result === "win").length;
  const losses = battleSet.battles.filter((b) => b.result === "loss").length;
  const draws = battleSet.battles.filter((b) => b.result === "draw").length;
  const recorded = wins + losses + draws;

  const COLLAPSE_KEY = "pogo-gbl-collapsed";
  const [collapsed, setCollapsed] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(COLLAPSE_KEY) ?? "[]");
      return (stored as string[]).includes(battleSet.id);
    } catch { return false; }
  });
  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        const stored: string[] = JSON.parse(localStorage.getItem(COLLAPSE_KEY) ?? "[]");
        const updated = next ? [...new Set([...stored, battleSet.id])] : stored.filter((id) => id !== battleSet.id);
        localStorage.setItem(COLLAPSE_KEY, JSON.stringify(updated));
      } catch { /* ignore */ }
      return next;
    });
  };

  const [setTeam, setSetTeam] = useState<[string, string, string]>(() => {
    const first = battleSet.battles[0];
    if (first && first.myTeam.some((m) => m !== "")) {
      return [...first.myTeam] as [string, string, string];
    }
    return ["", "", ""];
  });

  const applyTeamToAll = () => {
    onUpdate((s) => ({
      ...s,
      battles: s.battles.map((b) => ({ ...b, myTeam: [...setTeam] as [string, string, string] })),
    }));
  };

  const updateBattle = (battleId: string, patch: Partial<Battle>) => {
    onUpdate((s) => ({
      ...s,
      battles: s.battles.map((b) =>
        b.id === battleId ? { ...b, ...patch } : b
      ),
    }));
  };

  const hasTeam = setTeam.some((m) => m !== "");

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
      {/* Set header */}
      <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div
            className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer"
            onClick={toggleCollapsed}
          >
            <svg
              className={`w-3.5 h-3.5 shrink-0 text-gray-400 transition-transform ${collapsed ? "" : "rotate-90"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 shrink-0">
              Set {battleSet.setNumber}
            </h3>
            {collapsed ? (
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {battleSet.battles[0]?.league}
              </span>
            ) : (
              <select
                value={battleSet.battles[0]?.league ?? ""}
                onChange={(e) => {
                  const league = e.target.value;
                  onUpdate((s) => ({
                    ...s,
                    battles: s.battles.map((b) => ({ ...b, league })),
                  }));
                }}
                onClick={(e) => e.stopPropagation()}
                className="text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-1.5 py-1 min-w-0 flex-1"
              >
                {availableLeagues.map((l, i) => (
                  <option key={i} value={l.name}>{l.name}</option>
                ))}
              </select>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">
              <span className="text-green-600 dark:text-green-400">{wins}W</span>
              {" - "}
              <span className="text-red-600 dark:text-red-400">{losses}L</span>
              {draws > 0 && (
                <>
                  {" - "}
                  <span className="text-yellow-600 dark:text-yellow-400">{draws}D</span>
                </>
              )}
              {recorded > 0 && (
                <span className="text-gray-400 ml-1">
                  ({Math.round((wins / recorded) * 100)}%)
                </span>
              )}
            </span>
            <button
              onClick={onDelete}
              className="text-gray-400 hover:text-red-500 text-sm"
              title="Delete set"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Team template */}
        {!collapsed && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">My team</span>
              {savedTeams.length > 0 && (
                <select
                  value=""
                  onChange={(e) => {
                    const team = savedTeams.find((t) => t.id === e.target.value);
                    if (team) setSetTeam([...team.pokemon]);
                  }}
                  className="text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-1.5 py-1 w-auto shrink-0"
                >
                  <option value="" disabled>Preset</option>
                  {savedTeams.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              )}
              <button
                onClick={applyTeamToAll}
                disabled={!hasTeam}
                className="shrink-0 ml-auto px-2.5 py-1 text-xs font-medium rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Apply this team to all battles in this set"
              >
                Apply to all
              </button>
            </div>
            <TeamInput
              team={setTeam}
              onChange={setSetTeam}
              league={battleSet.battles[0]?.league}
              className="border-gray-300 dark:border-gray-600 divide-gray-300 dark:divide-gray-600 bg-white dark:bg-gray-700"
            />
          </div>
        )}
      </div>

      {/* Battles */}
      {!collapsed && (
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {battleSet.battles.map((battle, i) => (
            <BattleRow
              key={battle.id}
              battle={battle}
              index={i + 1}
              availableLeagues={availableLeagues}
              savedTeams={savedTeams}
              onUpdate={(patch) => updateBattle(battle.id, patch)}
            />
          ))}
        </div>
      )}

      {/* Rating after set */}
      {!collapsed && beforeRating && (
        <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
          <SetRatingInput
            beforeRating={beforeRating}
            endRating={battleSet.endRating}
            onSave={(rating) =>
              onUpdate((s) => ({ ...s, endRating: rating }))
            }
          />
        </div>
      )}
    </div>
  );
}

interface BattleRowProps {
  battle: Battle;
  index: number;
  availableLeagues: LeagueSchedule[];
  savedTeams: SavedTeam[];
  onUpdate: (patch: Partial<Battle>) => void;
}

function BattleRow({ battle, index, availableLeagues, savedTeams, onUpdate }: BattleRowProps) {
  const updateTeam = (team: "myTeam" | "opponentTeam", value: [string, string, string]) => {
    onUpdate({ [team]: value });
  };

  return (
    <div className="px-4 py-2.5 space-y-1.5 text-sm">
      {/* Row 1: battle number, league, W/L */}
      <div className="flex items-center gap-2">
        <span className="text-gray-400 w-5 shrink-0 text-center font-mono text-xs">{index}</span>

        <select
          value={battle.league}
          onChange={(e) => onUpdate({ league: e.target.value })}
          className="text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-1.5 py-1 min-w-0 flex-1"
        >
          {availableLeagues.map((l, i) => (
            <option key={i} value={l.name}>
              {l.name}
            </option>
          ))}
        </select>

        <div className="flex gap-1 shrink-0 ml-auto">
          <button
            onClick={() => onUpdate({ result: battle.result === "win" ? null : "win" })}
            className={`w-8 h-8 rounded text-xs font-bold transition-colors ${
              battle.result === "win"
                ? "bg-green-500 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-green-100 dark:hover:bg-green-900"
            }`}
          >
            W
          </button>
          <button
            onClick={() => onUpdate({ result: battle.result === "loss" ? null : "loss" })}
            className={`w-8 h-8 rounded text-xs font-bold transition-colors ${
              battle.result === "loss"
                ? "bg-red-500 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-red-100 dark:hover:bg-red-900"
            }`}
          >
            L
          </button>
          <button
            onClick={() => onUpdate({ result: battle.result === "draw" ? null : "draw" })}
            className={`w-8 h-8 rounded text-xs font-bold transition-colors ${
              battle.result === "draw"
                ? "bg-yellow-500 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-yellow-100 dark:hover:bg-yellow-900"
            }`}
          >
            D
          </button>
        </div>
      </div>

      {/* Row 2: my team */}
      <div className="space-y-1 pl-7">
        <div className="flex items-center gap-1.5">
          <span className="text-gray-400 dark:text-gray-500 text-xs shrink-0">Me</span>
          {savedTeams.length > 0 && (
            <select
              value=""
              onChange={(e) => {
                const team = savedTeams.find((t) => t.id === e.target.value);
                if (team) onUpdate({ myTeam: [...team.pokemon] as [string, string, string] });
              }}
              className="text-[10px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-1 py-0.5 w-auto shrink-0"
            >
              <option value="" disabled>Preset</option>
              {savedTeams.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          )}
        </div>
        <TeamInput
          team={battle.myTeam}
          onChange={(t) => updateTeam("myTeam", t)}
          league={battle.league}
        />
      </div>

      {/* Row 3: opponent team + player ID */}
      <div className="space-y-1 pl-7">
        <div className="flex items-center gap-1.5">
          <span className="text-gray-400 dark:text-gray-500 text-xs shrink-0">Opp</span>
          {savedTeams.length > 0 && (
            <select
              value=""
              onChange={(e) => {
                const team = savedTeams.find((t) => t.id === e.target.value);
                if (team) onUpdate({ opponentTeam: [...team.pokemon] as [string, string, string] });
              }}
              className="text-[10px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-1 py-0.5 w-auto shrink-0"
            >
              <option value="" disabled>Preset</option>
              {savedTeams.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          )}
          <input
            type="text"
            value={battle.opponentId ?? ""}
            onChange={(e) => onUpdate({ opponentId: e.target.value || undefined })}
            placeholder="Player ID"
            className="text-[10px] px-1.5 py-0.5 border border-gray-200 dark:border-gray-700 rounded bg-transparent placeholder:text-gray-300 dark:placeholder:text-gray-600 w-20 shrink-0 ml-auto"
          />
        </div>
        <TeamInput
          team={battle.opponentTeam}
          onChange={(t) => updateTeam("opponentTeam", t)}
          league={battle.league}
        />
      </div>
    </div>
  );
}
