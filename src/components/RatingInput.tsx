import { useState } from "react";
import type { Rating } from "../types";
import { formatRating, tierForElo, makeEloRating } from "../rating";

interface Props {
  rating?: Rating;
  onChange: (rating: Rating) => void;
  label: string;
}

export function RatingInput({ rating, onChange, label }: Props) {
  const [type, setType] = useState<"rank" | "elo">(rating?.type ?? "rank");
  const [value, setValue] = useState(rating?.value?.toString() ?? "");
  const [editing, setEditing] = useState(!rating);

  const handleTypeChange = (newType: "rank" | "elo") => {
    setType(newType);
    setValue("");
  };

  const handleSave = () => {
    const num = parseInt(value, 10);
    if (isNaN(num)) return;
    if (type === "rank" && (num < 1 || num > 20)) return;
    if (type === "elo" && num < 0) return;
    if (type === "elo") {
      onChange(makeEloRating(num, rating?.tier));
    } else {
      onChange({ type, value: num });
    }
    setEditing(false);
  };

  const tier = type === "elo" && value ? tierForElo(parseInt(value, 10) || 0) : null;

  if (rating && !editing) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {formatRating(rating)}
        </span>
        <button
          onClick={() => {
            setType(rating.type);
            setValue(rating.value.toString());
            setEditing(true);
          }}
          className="text-xs text-blue-500 hover:text-blue-600"
        >
          Edit
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <div className="flex items-center gap-1.5">
        <div className="flex rounded overflow-hidden border border-gray-300 dark:border-gray-600">
          <button
            onClick={() => handleTypeChange("rank")}
            className={`px-2 py-1 text-xs ${
              type === "rank"
                ? "bg-blue-500 text-white"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            }`}
          >
            Rank
          </button>
          <button
            onClick={() => handleTypeChange("elo")}
            className={`px-2 py-1 text-xs ${
              type === "elo"
                ? "bg-blue-500 text-white"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            }`}
          >
            ELO
          </button>
        </div>

        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          placeholder={type === "rank" ? "1-20" : "ELO rating"}
          min={type === "rank" ? 1 : 0}
          max={type === "rank" ? 20 : undefined}
          className="w-24 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
        />

        {tier && (
          <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">{tier}</span>
        )}

        <button
          onClick={handleSave}
          disabled={!value}
          className="px-2 py-1 text-xs font-medium rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Set
        </button>

        {rating && (
          <button
            onClick={() => setEditing(false)}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
