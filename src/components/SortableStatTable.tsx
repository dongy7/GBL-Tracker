import { useState } from "react";

interface PokemonStat {
  name: string;
  used: number;
  wins: number;
  losses: number;
  draws: number;
}

type SortKey = "name" | "used" | "wins" | "losses" | "winRate";
type SortDir = "asc" | "desc";

function getWinRate(p: PokemonStat): number {
  const total = p.wins + p.losses + p.draws;
  return total > 0 ? p.wins / total : -1;
}

function sortData(data: PokemonStat[], key: SortKey, dir: SortDir): PokemonStat[] {
  const sorted = [...data].sort((a, b) => {
    let cmp = 0;
    switch (key) {
      case "name": cmp = a.name.localeCompare(b.name); break;
      case "used": cmp = a.used - b.used; break;
      case "wins": cmp = a.wins - b.wins; break;
      case "losses": cmp = a.losses - b.losses; break;
      case "winRate": cmp = getWinRate(a) - getWinRate(b); break;
    }
    return dir === "asc" ? cmp : -cmp;
  });
  return sorted;
}

interface Props {
  data: PokemonStat[];
  nameHeader: string;
  countHeader: string;
  limit?: number;
}

export function SortableStatTable({ data, nameHeader, countHeader, limit }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("used");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "name" ? "asc" : "desc");
    }
  };

  const indicator = (key: SortKey) => {
    if (sortKey !== key) return "";
    return sortDir === "asc" ? " \u25B2" : " \u25BC";
  };

  const sorted = sortData(data, sortKey, sortDir);
  const displayed = limit ? sorted.slice(0, limit) : sorted;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
            <th
              className="pb-2 pr-4 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 select-none"
              onClick={() => handleSort("name")}
            >
              {nameHeader}{indicator("name")}
            </th>
            <th
              className="pb-2 pr-4 text-right cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 select-none"
              onClick={() => handleSort("used")}
            >
              {countHeader}{indicator("used")}
            </th>
            <th
              className="pb-2 pr-4 text-right cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 select-none"
              onClick={() => handleSort("wins")}
            >
              W{indicator("wins")}
            </th>
            <th
              className="pb-2 pr-4 text-right cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 select-none"
              onClick={() => handleSort("losses")}
            >
              L{indicator("losses")}
            </th>
            <th
              className="pb-2 text-right cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 select-none"
              onClick={() => handleSort("winRate")}
            >
              Win %{indicator("winRate")}
            </th>
          </tr>
        </thead>
        <tbody>
          {displayed.map((p) => {
            const totalWithResult = p.wins + p.losses + p.draws;
            const pWinRate =
              totalWithResult > 0
                ? ((p.wins / totalWithResult) * 100).toFixed(1)
                : "-";
            return (
              <tr
                key={p.name}
                className="border-b border-gray-100 dark:border-gray-800"
              >
                <td className="py-1.5 pr-4 text-gray-900 dark:text-gray-100">
                  {p.name}
                </td>
                <td className="py-1.5 pr-4 text-right text-gray-600 dark:text-gray-400">
                  {p.used}
                </td>
                <td className="py-1.5 pr-4 text-right text-green-600 dark:text-green-400">
                  {p.wins}
                </td>
                <td className="py-1.5 pr-4 text-right text-red-600 dark:text-red-400">
                  {p.losses}
                </td>
                <td className="py-1.5 text-right text-gray-700 dark:text-gray-300">
                  {pWinRate}
                  {pWinRate !== "-" ? "%" : ""}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
