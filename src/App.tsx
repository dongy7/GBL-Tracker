import { useState, useRef } from "react";
import { DatePicker } from "./components/DatePicker";
import { ActiveLeagues } from "./components/ActiveLeagues";
import { BattleSetCard } from "./components/BattleSetCard";
import { DaySummary } from "./components/DaySummary";
import { RatingInput } from "./components/RatingInput";
import ReportPage from "./components/ReportPage";
import { useDay } from "./hooks/useDay";
import type { Rating } from "./types";
import { useTheme } from "./hooks/useTheme";
import { getAvailableLeagues, SEASON_NAME } from "./leagues";
import { exportData, importData } from "./storage";

const THEME_ICONS: Record<string, string> = {
  light: "\u2600\uFE0F",
  dark: "\uD83C\uDF19",
  system: "\uD83D\uDCBB",
};

const THEME_LABELS: Record<string, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

function todayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function App() {
  const [page, setPage] = useState<"tracker" | "report">("tracker");
  const [date, setDate] = useState(todayString);
  const { dayRecord, addSet, updateSet, deleteSet, canAddSet, maxSets, setStartRating, previousDayRating } =
    useDay(date);
  const { theme, cycle } = useTheme();
  const availableLeagues = getAvailableLeagues(date);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const json = exportData();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gbl-tracker-${todayString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importData(reader.result as string);
        window.location.reload();
      } catch {
        alert("Invalid data file.");
      }
    };
    reader.readAsText(file);
    // Reset so the same file can be re-imported
    e.target.value = "";
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-bold">GBL Tracker</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Season: {SEASON_NAME}
              </p>
            </div>
            <nav className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 ml-4">
              <button
                onClick={() => setPage("tracker")}
                className={`px-3 py-1.5 text-xs font-medium ${
                  page === "tracker"
                    ? "bg-blue-500 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                Tracker
              </button>
              <button
                onClick={() => setPage("report")}
                className={`px-3 py-1.5 text-xs font-medium ${
                  page === "report"
                    ? "bg-blue-500 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                Reports
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <DatePicker date={date} onChange={setDate} />
            <button
              onClick={handleExport}
              className="px-2.5 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs transition-colors"
              title="Export data"
            >
              Export
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs transition-colors"
              title="Import data"
            >
              Import
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <button
              onClick={cycle}
              className="px-2.5 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm transition-colors"
              title={`Theme: ${THEME_LABELS[theme]}`}
            >
              {THEME_ICONS[theme]}
            </button>
          </div>
        </div>
      </header>

      {page === "tracker" ? (
        <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* Active leagues */}
          <ActiveLeagues leagues={availableLeagues} />

          {/* Start rating */}
          <RatingInput
            rating={dayRecord.startRating ?? previousDayRating ?? undefined}
            onChange={setStartRating}
            label="Day start rating:"
          />

          {/* Daily summary */}
          <DaySummary dayRecord={dayRecord} />

          {/* Battle sets */}
          <div className="space-y-4">
            {dayRecord.sets.map((set, i) => {
              // The "before" rating for this set is the previous set's endRating,
              // or the day's startRating for the first set
              const before: Rating | undefined =
                i > 0
                  ? dayRecord.sets[i - 1].endRating
                  : (dayRecord.startRating ?? previousDayRating ?? undefined);
              return (
                <BattleSetCard
                  key={set.id}
                  battleSet={set}
                  availableLeagues={availableLeagues}
                  beforeRating={before}
                  onUpdate={(updater) => updateSet(set.id, updater)}
                  onDelete={() => deleteSet(set.id)}
                />
              );
            })}
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
      ) : (
        <ReportPage />
      )}
    </div>
  );
}

export default App;
