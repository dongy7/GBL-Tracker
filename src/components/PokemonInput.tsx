import { useMemo, useCallback, useSyncExternalStore } from "react";
import Select, { type StylesConfig, type SingleValue } from "react-select";

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
import { POKEMON_NAMES } from "../pokemon";

const SHADOW_PREFIX = "Shadow ";

function parseShadow(value: string): { name: string; shadow: boolean } {
  if (value.startsWith(SHADOW_PREFIX)) {
    return { name: value.slice(SHADOW_PREFIX.length), shadow: true };
  }
  return { name: value, shadow: false };
}

interface Option {
  value: string;
  label: string;
}

const allOptions: Option[] = POKEMON_NAMES.map((n) => ({ value: n, label: n }));

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function PokemonInput({ value, onChange, placeholder, className }: Props) {
  const dark = useIsDark();
  const { name, shadow } = parseShadow(value);

  const selected = useMemo<Option | null>(
    () => (name ? { value: name, label: name } : null),
    [name],
  );

  const emit = useCallback(
    (pokeName: string, isShadow: boolean) => {
      if (!pokeName) {
        onChange("");
        return;
      }
      onChange(isShadow ? SHADOW_PREFIX + pokeName : pokeName);
    },
    [onChange],
  );

  const handleChange = useCallback(
    (opt: SingleValue<Option>) => {
      emit(opt?.value ?? "", shadow);
    },
    [emit, shadow],
  );

  const toggleShadow = useCallback(() => {
    emit(name, !shadow);
  }, [emit, name, shadow]);

  // Filter: match anywhere in the name, limit to 50 results for performance
  const filterOption = useCallback(
    (option: Option, input: string) =>
      option.value.toLowerCase().includes(input.toLowerCase()),
    [],
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
      }),
      valueContainer: (base) => ({
        ...base,
        padding: "0 4px",
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
      }),
      clearIndicator: (base) => ({
        ...base,
        padding: "0 2px",
        color: dark ? "rgb(156 163 175)" : "rgb(156 163 175)",
        ":hover": {
          color: dark ? "rgb(209 213 219)" : "rgb(55 65 81)",
        },
      }),
      dropdownIndicator: () => ({
        display: "none",
      }),
      indicatorSeparator: () => ({
        display: "none",
      }),
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
      singleValue: (base) => ({
        ...base,
        fontSize: "0.75rem",
        color: dark ? "rgb(209 213 219)" : undefined,
      }),
      placeholder: (base) => ({
        ...base,
        fontSize: "0.75rem",
        color: dark ? "rgb(75 85 99)" : undefined,
      }),
      noOptionsMessage: (base) => ({
        ...base,
        color: dark ? "rgb(156 163 175)" : undefined,
      }),
    }),
    [dark],
  );

  return (
    <div className="relative flex-1 min-w-0 flex items-center gap-0.5">
      <button
        type="button"
        onClick={toggleShadow}
        title={shadow ? "Shadow (click to toggle)" : "Normal (click to toggle)"}
        className={`shrink-0 w-5 h-5 rounded text-[9px] font-bold leading-none flex items-center justify-center transition-colors ${
          shadow
            ? "bg-purple-600 text-white"
            : "bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600 hover:text-purple-400"
        }`}
      >
        S
      </button>
      <div className="relative flex-1 min-w-0">
        <Select<Option, false>
          value={selected}
          onChange={handleChange}
          options={allOptions}
          filterOption={filterOption}
          placeholder={placeholder}
          isClearable
          styles={styles}
          className={className}
          classNamePrefix="pokemon-select"
          menuPlacement="auto"
          maxMenuHeight={192}
        />
      </div>
    </div>
  );
}
