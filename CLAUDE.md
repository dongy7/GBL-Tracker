# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev          # Start Vite dev server (http://localhost:5173/GBL-Tracker/)
npm run build        # TypeScript compilation (tsc -b) + Vite production build
npm run typecheck    # TypeScript type checking only
npm run lint         # ESLint
npm run check        # typecheck + lint combined
npm test             # Vitest single run
npm run test:watch   # Vitest watch mode
```

## Architecture

Pokemon Go Battle League tracker — a React 19 SPA with no backend. All data lives in localStorage.

**Stack:** React 19, TypeScript (strict), Tailwind CSS v4, Vite 8, Vitest, react-select

**Data flow:** User Action → Component → Custom Hook → localStorage → Re-render

### Key modules

- `src/types.ts` — All shared interfaces (DayRecord, BattleSet, Battle, SavedTeam, Rating, LeagueSchedule)
- `src/storage.ts` — localStorage persistence layer with two keys: `pogo-gbl-tracker` (day records by date) and `pogo-gbl-teams` (saved teams). Includes JSON export/import.
- `src/rating.ts` — ELO tier logic (Ace 2000+, Veteran 2500+, Legend 3000+). Tiers never demote.
- `src/leagues.ts` — Season schedule data with date-based league availability and set limits (5 normal, 10 on Thursdays).
- `src/pokemon.ts` — Static array of ~1100 Pokemon names used by the autocomplete.

### State management

Three custom hooks in `src/hooks/` handle all state — no Redux/Zustand:
- `useDay` — Daily battle record CRUD with automatic localStorage sync
- `useTeams` — Saved team presets CRUD
- `useTheme` — Light/dark/system theme toggling via `.dark` class on `<html>`

### Pages

The app has three views managed in `App.tsx`: Tracker (default, log battles), Teams (manage presets), Reports (analytics/charts).

## Styling

Tailwind CSS v4 with Vite plugin. Dark mode uses a `.dark` class on the document root (not `prefers-color-scheme` media query). The custom variant is defined in `src/index.css`:
```css
@custom-variant dark (&:where(.dark, .dark *));
```

react-select components use inline `StylesConfig` with a `useIsDark()` hook that watches the `.dark` class via MutationObserver.

## Deployment

GitHub Pages via `.github/workflows/deploy.yml`. Base URL is `/GBL-Tracker/` (set in `vite.config.ts`). Deploys on push to main.

## Testing

Tests are in `src/test/`. Vitest runs in jsdom environment. Tests cover rating logic, league schedule, and storage persistence. No component tests currently.
