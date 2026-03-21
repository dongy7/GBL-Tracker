import { useMemo } from "react";
import type { Rating } from "../types";
import { loadAllData } from "../storage";
import { formatRating, effectiveTier } from "../rating";
import EloChart from "./EloChart";
import { SortableStatTable } from "./SortableStatTable";
import { LeagueTabs } from "./LeagueTabs";

interface PokemonStat {
  name: string;
  used: number;
  wins: number;
  losses: number;
  draws: number;
}

export default function ReportPage() {
  const stats = useMemo(() => {
    const allData = loadAllData();
    const days = Object.values(allData).sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    let totalBattles = 0;
    let wins = 0;
    let losses = 0;
    let draws = 0;
    let totalSets = 0;

    const eloPoints: { date: string; elo: number }[] = [];
    let currentRating: Rating | undefined;
    let peakRating: Rating | undefined;

    // Pokemon usage: league -> pokemon name -> stats
    const pokemonByLeague: Record<string, Record<string, PokemonStat>> = {};
    // Lead tracking: league -> pokemon name -> stats
    const leadsByLeague: Record<string, Record<string, PokemonStat>> = {};
    const leaguesUsed = new Set<string>();

    for (const day of days) {
      // Collect ELO from startRating
      if (day.startRating && day.startRating.type === "elo") {
        eloPoints.push({ date: day.date, elo: day.startRating.value });
        if (!peakRating || day.startRating.value > peakRating.value) {
          peakRating = day.startRating;
        }
      }

      for (const set of day.sets) {
        totalSets++;

        for (const battle of set.battles) {
          if (battle.result === null) continue;
          totalBattles++;

          if (battle.result === "win") wins++;
          else if (battle.result === "loss") losses++;
          else if (battle.result === "draw") draws++;

          const league = battle.league || "Unknown";
          leaguesUsed.add(league);

          if (!pokemonByLeague[league]) {
            pokemonByLeague[league] = {};
          }
          const leagueStats = pokemonByLeague[league];

          for (const pokemon of battle.opponentTeam) {
            if (!pokemon) continue;
            if (!leagueStats[pokemon]) {
              leagueStats[pokemon] = {
                name: pokemon,
                used: 0,
                wins: 0,
                losses: 0,
                draws: 0,
              };
            }
            leagueStats[pokemon].used++;
            // Track your results against this Pokemon
            if (battle.result === "win") leagueStats[pokemon].wins++;
            else if (battle.result === "loss") leagueStats[pokemon].losses++;
            else if (battle.result === "draw") leagueStats[pokemon].draws++;
          }

          // Track opponent leads
          const lead = battle.opponentTeam[0];
          if (lead) {
            if (!leadsByLeague[league]) leadsByLeague[league] = {};
            const leagueLeads = leadsByLeague[league];
            if (!leagueLeads[lead]) {
              leagueLeads[lead] = { name: lead, used: 0, wins: 0, losses: 0, draws: 0 };
            }
            leagueLeads[lead].used++;
            if (battle.result === "win") leagueLeads[lead].wins++;
            else if (battle.result === "loss") leagueLeads[lead].losses++;
            else if (battle.result === "draw") leagueLeads[lead].draws++;
          }
        }

        // Collect ELO from endRating
        if (set.endRating && set.endRating.type === "elo") {
          eloPoints.push({ date: day.date, elo: set.endRating.value });
          currentRating = set.endRating;
          if (!peakRating || set.endRating.value > peakRating.value) {
            peakRating = set.endRating;
          }
        }
      }
    }

    const winRate = totalBattles > 0 ? (wins / totalBattles) * 100 : 0;

    // Build sorted pokemon lists per league
    const pokemonUsage: {
      league: string;
      pokemon: PokemonStat[];
    }[] = [];
    for (const league of Array.from(leaguesUsed).sort()) {
      const leagueStats = pokemonByLeague[league];
      if (!leagueStats) continue;
      const sorted = Object.values(leagueStats).sort(
        (a, b) => b.used - a.used
      );
      pokemonUsage.push({ league, pokemon: sorted });
    }

    // Build sorted lead lists per league
    const leadUsage: { league: string; pokemon: PokemonStat[] }[] = [];
    for (const league of Array.from(leaguesUsed).sort()) {
      const leagueLeads = leadsByLeague[league];
      if (!leagueLeads) continue;
      const sorted = Object.values(leagueLeads).sort((a, b) => b.used - a.used);
      leadUsage.push({ league, pokemon: sorted });
    }

    return {
      totalBattles,
      wins,
      losses,
      draws,
      winRate,
      totalSets,
      daysPlayed: days.length,
      eloPoints,
      currentRating,
      peakRating,
      pokemonUsage,
      leadUsage,
    };
  }, []);

  const {
    totalBattles,
    wins,
    losses,
    draws,
    winRate,
    totalSets,
    daysPlayed,
    eloPoints,
    currentRating,
    peakRating,
    pokemonUsage,
    leadUsage,
  } = stats;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Reports & Stats
      </h1>

      {/* Section 1: Overall Stats */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-5 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Overall Stats
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <StatBox label="Total Battles" value={totalBattles} />
          <StatBox label="Wins" value={wins} />
          <StatBox label="Losses" value={losses} />
          <StatBox label="Draws" value={draws} />
          <StatBox label="Win Rate" value={`${winRate.toFixed(1)}%`} />
          <StatBox label="Sets Played" value={totalSets} />
          <StatBox label="Days Played" value={daysPlayed} />
        </div>

        {/* W/L/D Distribution Bar */}
        {totalBattles > 0 && (
          <div className="space-y-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Win/Loss/Draw Distribution
            </p>
            <div className="flex h-6 rounded overflow-hidden">
              {wins > 0 && (
                <div
                  className="bg-green-500 flex items-center justify-center text-xs text-white font-medium"
                  style={{ width: `${(wins / totalBattles) * 100}%` }}
                >
                  {wins > 0 && totalBattles >= 5 ? `${wins}W` : ""}
                </div>
              )}
              {losses > 0 && (
                <div
                  className="bg-red-500 flex items-center justify-center text-xs text-white font-medium"
                  style={{ width: `${(losses / totalBattles) * 100}%` }}
                >
                  {losses > 0 && totalBattles >= 5 ? `${losses}L` : ""}
                </div>
              )}
              {draws > 0 && (
                <div
                  className="bg-yellow-500 flex items-center justify-center text-xs text-white font-medium"
                  style={{ width: `${(draws / totalBattles) * 100}%` }}
                >
                  {draws > 0 && totalBattles >= 5 ? `${draws}D` : ""}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Rating Progression */}
      {eloPoints.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-5 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Rating Progression
          </h2>

          <div className="flex gap-6 flex-wrap">
            {currentRating && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Current Rating
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {formatRating(currentRating)}
                </p>
                {effectiveTier(currentRating) && (
                  <p className="text-sm text-purple-500 dark:text-purple-400">
                    {effectiveTier(currentRating)}
                  </p>
                )}
              </div>
            )}
            {peakRating && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Peak Rating
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {formatRating(peakRating)}
                </p>
                {effectiveTier(peakRating) && (
                  <p className="text-sm text-purple-500 dark:text-purple-400">
                    {effectiveTier(peakRating)}
                  </p>
                )}
              </div>
            )}
          </div>

          <EloChart dataPoints={eloPoints} />
        </div>
      )}

      {/* Section 3: Opponent Leads */}
      {leadUsage.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-5 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Opponent Leads
          </h2>

          <LeagueTabs leagues={leadUsage.map((l) => l.league)}>
            {(selected) => {
              const match = leadUsage.find((l) => l.league === selected);
              return match ? (
                <SortableStatTable data={match.pokemon} nameHeader="Lead" countHeader="Seen" limit={10} />
              ) : null;
            }}
          </LeagueTabs>
        </div>
      )}

      {/* Section 4: Pokemon Usage */}
      {pokemonUsage.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-5 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Opponent Pokemon Usage
          </h2>

          <LeagueTabs leagues={pokemonUsage.map((l) => l.league)}>
            {(selected) => {
              const match = pokemonUsage.find((l) => l.league === selected);
              return match ? (
                <SortableStatTable data={match.pokemon} nameHeader="Pokemon" countHeader="Used" />
              ) : null;
            }}
          </LeagueTabs>
        </div>
      )}
    </div>
  );
}

function StatBox({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
        {value}
      </p>
    </div>
  );
}
