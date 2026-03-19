import { useState } from "react";
import type { BattleSet, Battle, Rating } from "../types";
import type { LeagueSchedule } from "../types";
import { PokemonInput } from "./PokemonInput";
import { SetRatingInput } from "./SetRatingInput";

const INPUT_CLASS = "w-full px-2 py-1 text-xs border border-gray-200 dark:border-gray-700 rounded bg-transparent placeholder:text-gray-300 dark:placeholder:text-gray-600";
const HEADER_INPUT_CLASS = "w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 placeholder:text-gray-300 dark:placeholder:text-gray-500";

interface Props {
  battleSet: BattleSet;
  availableLeagues: LeagueSchedule[];
  beforeRating?: Rating;
  onUpdate: (updater: (s: BattleSet) => BattleSet) => void;
  onDelete: () => void;
}

export function BattleSetCard({ battleSet, availableLeagues, beforeRating, onUpdate, onDelete }: Props) {
  const wins = battleSet.battles.filter((b) => b.won === true).length;
  const losses = battleSet.battles.filter((b) => b.won === false).length;
  const recorded = wins + losses;

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
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Set {battleSet.setNumber}
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">
              <span className="text-green-600 dark:text-green-400">{wins}W</span>
              {" - "}
              <span className="text-red-600 dark:text-red-400">{losses}L</span>
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
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500 dark:text-gray-400 w-14 shrink-0">My team</span>
          {setTeam.map((mon, i) => (
            <PokemonInput
              key={i}
              value={mon}
              onChange={(v) => {
                const next = [...setTeam] as [string, string, string];
                next[i] = v;
                setSetTeam(next);
              }}
              placeholder={`Pokemon ${i + 1}`}
              className={HEADER_INPUT_CLASS}
            />
          ))}
          <button
            onClick={applyTeamToAll}
            disabled={!hasTeam}
            className="shrink-0 px-2.5 py-1 text-xs font-medium rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Apply this team to all battles in this set"
          >
            Apply to all
          </button>
        </div>
      </div>

      {/* Battles */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {battleSet.battles.map((battle, i) => (
          <BattleRow
            key={battle.id}
            battle={battle}
            index={i + 1}
            availableLeagues={availableLeagues}
            onUpdate={(patch) => updateBattle(battle.id, patch)}
          />
        ))}
      </div>

      {/* Rating after set */}
      {beforeRating && (
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
  onUpdate: (patch: Partial<Battle>) => void;
}

function BattleRow({ battle, index, availableLeagues, onUpdate }: BattleRowProps) {
  const updateTeamMember = (
    team: "myTeam" | "opponentTeam",
    idx: number,
    value: string
  ) => {
    const newTeam = [...battle[team]] as [string, string, string];
    newTeam[idx] = value;
    onUpdate({ [team]: newTeam });
  };

  return (
    <div className="px-4 py-2.5 space-y-1.5 text-sm">
      {/* Row 1: battle number, league, W/L */}
      <div className="flex items-center gap-2">
        <span className="text-gray-400 w-5 shrink-0 text-center font-mono text-xs">{index}</span>

        <select
          value={battle.league}
          onChange={(e) => onUpdate({ league: e.target.value })}
          className="text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-1.5 py-1 w-auto shrink-0"
        >
          {availableLeagues.map((l, i) => (
            <option key={i} value={l.name}>
              {l.name}
            </option>
          ))}
        </select>

        <div className="flex gap-1 shrink-0 ml-auto">
          <button
            onClick={() => onUpdate({ won: battle.won === true ? null : true })}
            className={`w-8 h-8 rounded text-xs font-bold transition-colors ${
              battle.won === true
                ? "bg-green-500 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-green-100 dark:hover:bg-green-900"
            }`}
          >
            W
          </button>
          <button
            onClick={() => onUpdate({ won: battle.won === false ? null : false })}
            className={`w-8 h-8 rounded text-xs font-bold transition-colors ${
              battle.won === false
                ? "bg-red-500 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-red-100 dark:hover:bg-red-900"
            }`}
          >
            L
          </button>
        </div>
      </div>

      {/* Row 2: my team */}
      <div className="flex items-center gap-1.5 pl-7">
        <span className="text-gray-400 dark:text-gray-500 text-xs w-8 shrink-0">Me</span>
        {battle.myTeam.map((mon, i) => (
          <PokemonInput
            key={i}
            value={mon}
            onChange={(v) => updateTeamMember("myTeam", i, v)}
            placeholder={`Pokemon ${i + 1}`}
            className={INPUT_CLASS}
          />
        ))}
      </div>

      {/* Row 3: opponent team */}
      <div className="flex items-center gap-1.5 pl-7">
        <span className="text-gray-400 dark:text-gray-500 text-xs w-8 shrink-0">Opp</span>
        {battle.opponentTeam.map((mon, i) => (
          <PokemonInput
            key={i}
            value={mon}
            onChange={(v) => updateTeamMember("opponentTeam", i, v)}
            placeholder={`Pokemon ${i + 1}`}
            className={INPUT_CLASS}
          />
        ))}
      </div>
    </div>
  );
}
