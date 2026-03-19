import { useState } from "react";
import { DatePicker } from "./components/DatePicker";
import { ActiveLeagues } from "./components/ActiveLeagues";
import { BattleSetCard } from "./components/BattleSetCard";
import { DaySummary } from "./components/DaySummary";
import { useDay } from "./hooks/useDay";
import { getAvailableLeagues, SEASON_NAME } from "./leagues";

function todayString(): string {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

function App() {
  const [date, setDate] = useState(todayString);
  const { dayRecord, addSet, updateSet, deleteSet, canAddSet, maxSets } =
    useDay(date);
  const availableLeagues = getAvailableLeagues(date);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">GBL Tracker</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Season: {SEASON_NAME}
            </p>
          </div>
          <DatePicker date={date} onChange={setDate} />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Active leagues */}
        <ActiveLeagues leagues={availableLeagues} />

        {/* Daily summary */}
        <DaySummary dayRecord={dayRecord} />

        {/* Battle sets */}
        <div className="space-y-4">
          {dayRecord.sets.map((set) => (
            <BattleSetCard
              key={set.id}
              battleSet={set}
              availableLeagues={availableLeagues}
              onUpdate={(updater) => updateSet(set.id, updater)}
              onDelete={() => deleteSet(set.id)}
            />
          ))}
        </div>

        {/* Add set button */}
        {availableLeagues.length > 0 && (
          <button
            onClick={addSet}
            disabled={!canAddSet}
            className="w-full py-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            + Add Set ({dayRecord.sets.length}/{maxSets})
          </button>
        )}
      </main>
    </div>
  );
}

export default App;
