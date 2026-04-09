import { useCallback, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Select, { type StylesConfig, type SingleValue } from "react-select";
import { POKEMON_NAMES } from "../pokemon";
import { getLeaguePokemon } from "../leaguePokemon";

const SHADOW_PREFIX = "Shadow ";

function parseShadow(value: string): { name: string; shadow: boolean } {
  if (value.startsWith(SHADOW_PREFIX)) {
    return { name: value.slice(SHADOW_PREFIX.length), shadow: true };
  }
  return { name: value, shadow: false };
}

function useIsDark() {
  return useSyncExternalStore(
    (cb) => {
      const obs = new MutationObserver(cb);
      obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
      return () => obs.disconnect();
    },
    () => document.documentElement.classList.contains("dark"),
  );
}

interface Option {
  value: string;
  label: string;
}

const allOptions: Option[] = POKEMON_NAMES.map((n) => ({ value: n, label: n }));

interface Props {
  team: [string, string, string];
  onChange: (team: [string, string, string]) => void;
  className?: string;
  league?: string;
}

export function TeamInput({ team, onChange, className, league }: Props) {
  const dark = useIsDark();
  const [focusedIdx, setFocusedIdx] = useState<number | null>(null);
  const selectRefs = useRef<({ focus: () => void } | null)[]>([null, null, null]);

  const leaguePokemon = league ? getLeaguePokemon(league) : null;
  const options = useMemo(() => {
    if (!leaguePokemon) return allOptions;
    return leaguePokemon.map((n) => ({ value: n, label: n }));
  }, [leaguePokemon]);

  const filterOption = useCallback(
    (option: Option, input: string) => {
      if (!input) return true;
      return option.value.toLowerCase().includes(input.toLowerCase());
    },
    [],
  );

  const updateSlot = useCallback(
    (index: number, value: string) => {
      const next = [...team] as [string, string, string];
      next[index] = value;
      onChange(next);
    },
    [team, onChange],
  );

  const toggleShadow = useCallback(
    (index: number) => {
      const { name, shadow } = parseShadow(team[index]);
      if (!name) return;
      updateSlot(index, shadow ? name : SHADOW_PREFIX + name);
    },
    [team, updateSlot],
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        e.stopPropagation();
        toggleShadow(index);
      }
    },
    [toggleShadow],
  );

  const styles = useMemo<StylesConfig<Option, false>>(
    () => ({
      control: (base) => ({
        ...base,
        minHeight: "unset",
        fontSize: "0.75rem",
        lineHeight: "1rem",
        background: "transparent",
        border: "none",
        boxShadow: "none",
        borderRadius: 0,
        padding: "4px 0",
      }),
      valueContainer: (base) => ({
        ...base,
        padding: "0 4px",
        flexWrap: "nowrap",
      }),
      input: (base) => ({
        ...base,
        margin: 0,
        padding: 0,
        fontSize: "0.75rem",
        color: dark ? "rgb(209 213 219)" : undefined,
      }),
      indicatorsContainer: (base) => ({
        ...base,
        position: "absolute",
        right: 0,
        top: "50%",
        transform: "translateY(-50%)",
      }),
      clearIndicator: (base) => ({
        ...base,
        padding: "0 2px",
        color: "rgb(156 163 175)",
        ":hover": {
          color: dark ? "rgb(209 213 219)" : "rgb(55 65 81)",
        },
      }),
      dropdownIndicator: () => ({ display: "none" }),
      indicatorSeparator: () => ({ display: "none" }),
      menu: (base) => ({
        ...base,
        fontSize: "0.75rem",
        zIndex: 50,
        marginTop: "2px",
        backgroundColor: dark ? "rgb(31 41 55)" : "white",
        border: dark ? "1px solid rgb(55 65 81)" : "1px solid rgb(229 231 235)",
        borderRadius: "0.25rem",
        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
        left: 0,
        right: 0,
        width: "100%",
      }),
      option: (base, state) => ({
        ...base,
        padding: "4px 8px",
        backgroundColor: state.isFocused
          ? "rgb(59 130 246)"
          : dark
            ? "rgb(31 41 55)"
            : "white",
        color: state.isFocused ? "white" : dark ? "rgb(209 213 219)" : "rgb(55 65 81)",
        cursor: "pointer",
      }),
      placeholder: (base) => ({
        ...base,
        fontSize: "0.75rem",
        color: dark ? "rgb(75 85 99)" : undefined,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }),
      singleValue: (base) => ({
        ...base,
        fontSize: "0.75rem",
        color: dark ? "rgb(209 213 219)" : undefined,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }),
      noOptionsMessage: (base) => ({
        ...base,
        color: dark ? "rgb(156 163 175)" : undefined,
      }),
    }),
    [dark],
  );

  return (
    <div
      className={`flex rounded border divide-x ${
        dark
          ? "border-gray-700 divide-gray-700"
          : "border-gray-200 divide-gray-200"
      } ${className ?? ""}`}
    >
      {team.map((mon, i) => {
        const { name, shadow } = parseShadow(mon);
        const selected: Option | null = name ? { value: name, label: name } : null;
        const isFocused = focusedIdx === i;

        return (
          <div
            key={i}
            className={`flex-1 min-w-0 flex items-center relative ${
              isFocused ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
            }`}
          >
            <button
              type="button"
              tabIndex={-1}
              onClick={() => toggleShadow(i)}
              title={`Toggle shadow (Alt+S)${shadow ? " — Shadow" : ""}`}
              className={`shrink-0 w-4 h-4 ml-1 rounded text-[8px] font-bold leading-none flex items-center justify-center transition-colors ${
                shadow
                  ? "bg-purple-600 text-white"
                  : "bg-transparent text-gray-300 dark:text-gray-600 hover:text-purple-400"
              }`}
            >
              S
            </button>
            <div className="relative flex-1 min-w-0">
              <Select<Option, false>
                ref={(ref) => { selectRefs.current[i] = ref; }}
                value={selected}
                onChange={(opt: SingleValue<Option>) => {
                  const val = opt?.value ?? "";
                  updateSlot(i, val ? (shadow ? SHADOW_PREFIX + val : val) : "");
                }}
                options={options}
                filterOption={filterOption}
                placeholder={`Pokemon ${i + 1}`}
                isClearable
                styles={styles}
                classNamePrefix="pokemon-select"
                menuPlacement="auto"
                maxMenuHeight={192}
                onFocus={() => setFocusedIdx(i)}
                onBlur={() => setFocusedIdx((prev) => (prev === i ? null : prev))}
                onKeyDown={(e) => handleKeyDown(i, e)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
