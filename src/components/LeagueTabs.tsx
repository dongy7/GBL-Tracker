import { useState } from "react";
import { getLeagueColor, getLeagueIcon } from "./LeagueBadge";

interface Props {
  leagues: string[];
  children: (selectedLeague: string) => React.ReactNode;
}

export function LeagueTabs({ leagues, children }: Props) {
  const [selected, setSelected] = useState(leagues[0] ?? "");

  if (leagues.length <= 1) {
    return <>{children(leagues[0] ?? "")}</>;
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1">
        {leagues.map((league) => {
          const isSelected = league === selected;
          const icon = getLeagueIcon(league);
          return (
            <button
              key={league}
              onClick={() => setSelected(league)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                isSelected
                  ? "bg-blue-500 text-white"
                  : `${getLeagueColor(league)} hover:opacity-80`
              }`}
            >
              {icon && <img src={icon} alt="" className="w-3.5 h-3.5" />}
              {league}
            </button>
          );
        })}
      </div>
      {children(selected)}
    </div>
  );
}
