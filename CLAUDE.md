# Lajvstart

A platform for LARP organizers to list their events and for LARP players to find events and event info.

## Tech Stack

- Astro: Web server
- HTMX: Server-side rendering and SPA-like updates on the client
- Alpine: Client-side state management and UI interactions

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

## External Services

Supabase: Database, auth, and storage
Netlify: Hosting and CI/CD
