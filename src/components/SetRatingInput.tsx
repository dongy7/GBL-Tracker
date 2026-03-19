import { useState } from "react";
import type { Rating } from "../types";
import { formatRating, ratingDelta, effectiveTier, makeEloRating } from "../rating";

interface Props {
  beforeRating: Rating;
  endRating?: Rating;
  onSave: (rating: Rating) => void;
}

export function SetRatingInput({ beforeRating, endRating, onSave }: Props) {
  const isElo = beforeRating.type === "elo";
  const [mode, setMode] = useState<"delta" | "absolute">(isElo ? "delta" : "absolute");
  const [value, setValue] = useState("");
  const [editing, setEditing] = useState(!endRating);

  const prevTier = effectiveTier(beforeRating);

  if (endRating && !editing) {
    const delta = ratingDelta(beforeRating, endRating);
    const isPositive = endRating.type === "elo" && endRating.value > beforeRating.value;
    const isNegative = endRating.type === "elo" && endRating.value < beforeRating.value;

    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="text-gray-500 dark:text-gray-400">After:</span>
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {formatRating(endRating)}
        </span>
        {delta && (
          <span
            className={
              isPositive
                ? "text-green-600 dark:text-green-400 font-medium"
                : isNegative
                  ? "text-red-600 dark:text-red-400 font-medium"
                  : "text-gray-500"
            }
          >
            ({delta})
          </span>
        )}
        <button
          onClick={() => { setEditing(true); setValue(""); }}
          className="text-blue-500 hover:text-blue-600"
        >
          Edit
        </button>
      </div>
    );
  }

  const handleSave = () => {
    const num = parseInt(value, 10);
    if (isNaN(num)) return;

    if (isElo) {
      if (mode === "delta") {
        onSave(makeEloRating(beforeRating.value + num, prevTier));
      } else {
        if (num < 0) return;
        onSave(makeEloRating(num, prevTier));
      }
    } else {
      // Rank mode
      if (num >= 1 && num <= 20) {
        onSave({ type: "rank", value: num });
      } else if (num > 20) {
        // Transitioned to ELO
        onSave(makeEloRating(num));
      }
    }
    setEditing(false);
    setValue("");
  };

  const previewElo = isElo && mode === "delta" && value
    ? beforeRating.value + (parseInt(value, 10) || 0)
    : null;
  const previewRating = previewElo !== null ? makeEloRating(previewElo, prevTier) : null;
  const previewTierLabel = previewRating ? effectiveTier(previewRating) : null;

  return (
    <div className="flex items-center gap-1.5 text-xs flex-wrap">
      <span className="text-gray-500 dark:text-gray-400">After set:</span>

      {isElo && (
        <div className="flex rounded overflow-hidden border border-gray-300 dark:border-gray-600">
          <button
            onClick={() => { setMode("delta"); setValue(""); }}
            className={`px-1.5 py-0.5 ${
              mode === "delta"
                ? "bg-blue-500 text-white"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            }`}
          >
            +/-
          </button>
          <button
            onClick={() => { setMode("absolute"); setValue(""); }}
            className={`px-1.5 py-0.5 ${
              mode === "absolute"
                ? "bg-blue-500 text-white"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            }`}
          >
            Total
          </button>
        </div>
      )}

      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSave()}
        placeholder={
          isElo
            ? mode === "delta"
              ? "+/- ELO"
              : "New ELO"
            : "New rank (1-20 or ELO)"
        }
        className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
      />

      {previewElo !== null && (
        <span className="text-gray-400">
          → {previewElo}
          {previewTierLabel && <span className="text-purple-500 ml-1">{previewTierLabel}</span>}
        </span>
      )}

      <button
        onClick={handleSave}
        disabled={!value}
        className="px-2 py-1 font-medium rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Save
      </button>

      {endRating && (
        <button
          onClick={() => setEditing(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
