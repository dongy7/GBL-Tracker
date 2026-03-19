import { useState, useRef, useEffect, useCallback } from "react";
import { POKEMON_NAMES } from "../pokemon";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function PokemonInput({ value, onChange, placeholder, className }: Props) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Sync external value changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  const matches = open && query.length >= 1
    ? POKEMON_NAMES.filter((n) =>
        n.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

  const select = useCallback((name: string) => {
    setQuery(name);
    onChange(name);
    setOpen(false);
  }, [onChange]);

  const handleChange = (text: string) => {
    setQuery(text);
    setOpen(true);
    setHighlightIndex(0);
    if (text === "") {
      onChange("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || matches.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, matches.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      select(matches[highlightIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  // Scroll highlighted item into view
  useEffect(() => {
    if (listRef.current) {
      const item = listRef.current.children[highlightIndex] as HTMLElement;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightIndex]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={containerRef} className="relative flex-1 min-w-0">
      <input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => { if (query.length >= 1) setOpen(true); }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={className}
      />
      {open && matches.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-50 left-0 right-0 top-full mt-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg max-h-48 overflow-y-auto text-xs"
        >
          {matches.map((name, i) => (
            <li
              key={name}
              onMouseDown={() => select(name)}
              onMouseEnter={() => setHighlightIndex(i)}
              className={`px-2 py-1.5 cursor-pointer ${
                i === highlightIndex
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
