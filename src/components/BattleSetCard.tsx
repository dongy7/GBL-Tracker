import type { BattleSet, Battle } from "../types";
import type { LeagueSchedule } from "../types";

interface Props {
  battleSet: BattleSet;
  availableLeagues: LeagueSchedule[];
  onUpdate: (updater: (s: BattleSet) => BattleSet) => void;
  onDelete: () => void;
}

export function BattleSetCard({ battleSet, availableLeagues, onUpdate, onDelete }: Props) {
  const wins = battleSet.battles.filter((b) => b.won === true).length;
  const losses = battleSet.battles.filter((b) => b.won === false).length;
  const recorded = wins + losses;

  const updateBattle = (battleId: string, patch: Partial<Battle>) => {
    onUpdate((s) => ({
      ...s,
      battles: s.battles.map((b) =>
        b.id === battleId ? { ...b, ...patch } : b
      ),
    }));
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Set header */}
      <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 flex items-center justify-between">
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
    <div className="px-4 py-2.5 flex items-center gap-3 text-sm">
      {/* Battle number */}
      <span className="text-gray-400 w-6 text-center font-mono">{index}</span>

      {/* League selector */}
      <select
        value={battle.league}
        onChange={(e) => onUpdate({ league: e.target.value })}
        className="text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-1.5 py-1 max-w-32 truncate"
      >
        {availableLeagues.map((l, i) => (
          <option key={i} value={l.name}>
            {l.name}
          </option>
        ))}
      </select>

      {/* Win/Loss buttons */}
      <div className="flex gap-1">
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

      {/* My team */}
      <div className="flex-1 flex gap-1">
        {battle.myTeam.map((mon, i) => (
          <input
            key={i}
            type="text"
            value={mon}
            onChange={(e) => updateTeamMember("myTeam", i, e.target.value)}
            placeholder={`My #${i + 1}`}
            className="flex-1 min-w-0 px-2 py-1 text-xs border border-gray-200 dark:border-gray-700 rounded bg-transparent placeholder:text-gray-300 dark:placeholder:text-gray-600"
          />
        ))}
      </div>

      <span className="text-gray-300 dark:text-gray-600 text-xs">vs</span>

      {/* Opponent team */}
      <div className="flex-1 flex gap-1">
        {battle.opponentTeam.map((mon, i) => (
          <input
            key={i}
            type="text"
            value={mon}
            onChange={(e) =>
              updateTeamMember("opponentTeam", i, e.target.value)
            }
            placeholder={`Opp #${i + 1}`}
            className="flex-1 min-w-0 px-2 py-1 text-xs border border-gray-200 dark:border-gray-700 rounded bg-transparent placeholder:text-gray-300 dark:placeholder:text-gray-600"
          />
        ))}
      </div>
    </div>
  );
}
