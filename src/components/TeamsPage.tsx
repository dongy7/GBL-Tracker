import { useState } from "react";
import type { SavedTeam } from "../types";
import { TeamInput } from "./TeamInput";
import { LeagueNameBadge } from "./LeagueBadge";
import { LEAGUE_SCHEDULES } from "../leagues";

const UNIQUE_LEAGUES = [...new Set(LEAGUE_SCHEDULES.map((l) => l.name))].sort();


interface Props {
  teams: SavedTeam[];
  onAdd: (team: Omit<SavedTeam, "id">) => void;
  onUpdate: (id: string, patch: Partial<SavedTeam>) => void;
  onDelete: (id: string) => void;
}

export default function TeamsPage({ teams, onAdd, onUpdate, onDelete }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPokemon, setNewPokemon] = useState<[string, string, string]>(["", "", ""]);
  const [newLeagues, setNewLeagues] = useState<Set<string>>(new Set());

  const handleAdd = () => {
    if (!newName.trim() || newLeagues.size === 0) return;
    onAdd({
      name: newName.trim(),
      pokemon: newPokemon,
      leagues: [...newLeagues],
    });
    setNewName("");
    setNewPokemon(["", "", ""]);
    setNewLeagues(new Set());
    setShowForm(false);
  };

  const toggleNewLeague = (league: string) => {
    const next = new Set(newLeagues);
    if (next.has(league)) next.delete(league);
    else next.add(league);
    setNewLeagues(next);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Saved Teams
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          {showForm ? "Cancel" : "+ New Team"}
        </button>
      </div>

      {/* New team form */}
      {showForm && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3 bg-gray-50 dark:bg-gray-800">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Team name"
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 placeholder:text-gray-400"
          />

          <div className="space-y-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">Pokemon</span>
            <TeamInput team={newPokemon} onChange={setNewPokemon} />
          </div>

          <div className="space-y-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">Leagues</span>
            <div className="flex flex-wrap gap-1.5">
              {UNIQUE_LEAGUES.map((league) => (
                <LeagueNameBadge
                  key={league}
                  name={league}
                  selected={newLeagues.has(league)}
                  onClick={() => toggleNewLeague(league)}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={!newName.trim() || newLeagues.size === 0}
            className="px-4 py-2 text-sm font-medium rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Save Team
          </button>
        </div>
      )}

      {/* Team list */}
      {teams.length === 0 && !showForm && (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          No saved teams yet. Create one to use as a preset when recording battles.
        </p>
      )}

      <div className="space-y-3">
        {teams.map((team) => (
          <TeamCard
            key={team.id}
            team={team}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

interface TeamCardProps {
  team: SavedTeam;
  onUpdate: (id: string, patch: Partial<SavedTeam>) => void;
  onDelete: (id: string) => void;
}

function TeamCard({ team, onUpdate, onDelete }: TeamCardProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(team.name);
  const [pokemon, setPokemon] = useState<[string, string, string]>([...team.pokemon]);
  const [leagues, setLeagues] = useState<Set<string>>(new Set(team.leagues));

  const toggleLeague = (league: string) => {
    const next = new Set(leagues);
    if (next.has(league)) next.delete(league);
    else next.add(league);
    setLeagues(next);
  };

  const handleSave = () => {
    onUpdate(team.id, {
      name: name.trim(),
      pokemon,
      leagues: [...leagues],
    });
    setEditing(false);
  };

  const handleCancel = () => {
    setName(team.name);
    setPokemon([...team.pokemon]);
    setLeagues(new Set(team.leagues));
    setEditing(false);
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="px-4 py-3 space-y-2">
        {/* Header */}
        <div className="flex items-center justify-between">
          {editing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-sm font-semibold px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
            />
          ) : (
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {team.name}
            </h3>
          )}
          <div className="flex gap-2">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  className="text-xs text-blue-500 hover:text-blue-600 font-medium"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="text-xs text-blue-500 hover:text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(team.id)}
                  className="text-xs text-gray-400 hover:text-red-500"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        {/* Pokemon */}
        {editing ? (
          <TeamInput team={pokemon} onChange={setPokemon} />
        ) : (
          <div className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
            {team.pokemon.map((mon, i) => (
              <span key={i} className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs">
                {mon || <span className="text-gray-400 italic">empty</span>}
              </span>
            ))}
          </div>
        )}

        {/* Leagues */}
        {editing ? (
          <div className="flex flex-wrap gap-1.5">
            {UNIQUE_LEAGUES.map((league) => (
              <button
                key={league}
                onClick={() => toggleLeague(league)}
                className={`px-2 py-0.5 text-xs rounded-full border transition-colors ${
                  leagues.has(league)
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:border-blue-400"
                }`}
              >
                {league}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1">
            {team.leagues.map((league) => (
              <LeagueNameBadge key={league} name={league} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
