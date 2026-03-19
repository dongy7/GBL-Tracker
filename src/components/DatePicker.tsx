import { isThursday } from "../leagues";

interface Props {
  date: string;
  onChange: (date: string) => void;
}

export function DatePicker({ date, onChange }: Props) {
  const thursday = isThursday(date);

  const shift = (days: number) => {
    const d = new Date(date + "T12:00:00");
    d.setDate(d.getDate() + days);
    onChange(d.toISOString().split("T")[0]);
  };

  return (
    <div className="flex items-center justify-center gap-3">
      <button
        onClick={() => shift(-1)}
        className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-lg"
      >
        &larr;
      </button>
      <div className="text-center">
        <input
          type="date"
          value={date}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-lg"
        />
        {thursday && (
          <div className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1">
            GO Battle Thursday — 10 sets available!
          </div>
        )}
      </div>
      <button
        onClick={() => shift(1)}
        className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-lg"
      >
        &rarr;
      </button>
    </div>
  );
}
