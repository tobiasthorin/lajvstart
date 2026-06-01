# Lajvstart

A platform for LARP organizers to list their events and for LARP players to find events and event info.

## Tech Stack

- The database, auth, and storage is hosted on Supabase
- Key frameworks/libraries
  - Astro
  - HTMX
  - Alpine

## Dev Setup

Commands to install dependencies and run the project locally.

## Common Commands

- `npm run dev` — start dev server
- `npm run types` — generate TypeScript types from databse schema
- `npm run migrate` — run database migrations

## Architecture

- src/components - Reusable components
- src/layouts - HTML layouts
- src/lib - Important internal functions or wrappers for libraries
- src/middleware - Middleware that is run on every request
- src/pages - The actual pages served to the client. The structure ofthis folder is also the routing.
- src/services - Functions interfacing with the database
- src/types - TypeScript types
- src/utils - Utility and small helper functions

## Conventions

Any project-specific patterns: naming, file structure, state management approach, etc.

## External Services

APIs or services this project depends on, and where credentials come from.
