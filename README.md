# GBL Tracker

A web app for tracking your Pokemon Go Battle League sets, teams, and rating progression.

## Features

- **Daily battle tracking** — Record wins, losses, and draws for each battle across up to 5 sets per day (10 on GO Battle Thursdays)
- **League awareness** — Automatically shows available leagues and cups based on the current GBL season schedule (Memories in Motion)
- **Team logging** — Track your team and opponent teams for each battle with searchable Pokemon name autocomplete
- **Team templates** — Set your team once per set and apply it to all battles
- **Rating progression** — Track rank (1-20) or ELO rating throughout the day with per-set deltas
- **Permanent tier tracking** — Ace (2000+), Veteran (2500+), and Legend (3000+) tiers are preserved even if ELO drops
- **Daily summaries** — Win rate stats with per-league breakdowns and visual progress bar
- **Reports page** — Overall battle stats, ELO progression chart with tier milestones, and opponent Pokemon usage stats grouped by league
- **Data export/import** — Back up your data as JSON and restore it on any device
- **Light/dark mode** — Toggle between light, dark, and system themes
- **Local persistence** — All data saved to localStorage

## Getting Started

```sh
npm install
npm run dev
```

## Tech Stack

- React + TypeScript
- Tailwind CSS v4
- Vite
