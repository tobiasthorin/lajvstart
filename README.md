# Lajvstart

[Lajvstart](https://www.lajvstart.se) är ett projekt som på lång sikt ämnar bli ett nav för lajvsverige, och kanske mer därtill.

För diskussioner, feedback, och support - gå med i Lajvstarts [Discord](https://discord.gg/bdA6hfXBgu).

## Struktur

Projektet fick sin början till stor del på grund av nyfikenhet på ny och lite annorlunda teknologi, därför är teknologistacken som följer:

- Databas (Postgresql), autentisering, och fillagring sköts av [Supabase](https://supabase.com/).
- Webbservern är [Astro](https://astro.build/) (i Server Side Rendering-läge) och kör på [Netlify](https://www.netlify.com/).
- Astro servar HTML som med hjälp av [HTMX](https://htmx.org/) gör partiella siduppdateringar i webläsaren.
- Stylingen görs med [Tailwind](https://tailwindcss.com/).
- Små interaktiva bitar sköts med det deklarativa JavaScript-biblioteket [Alpine](https://alpinejs.dev/).

Man kan till och med kalla det för [AHA-stacken](https://ahastack.dev/)!

## Lokal utveckling

### Installation

- Klona repot till din dator och installera dependencies med
  ```
  npm install
  ```

- Se till att du har Docker installerat och kör sedan
  ```
  npx supabase init
  ```
  och
  ```
  npx supabase start
  ```
  Detta startar ett gäng containers lokalt med databas, dashboard mm så att du kan utveckla helt och hållet mot en lokal infrastruktur och inte behöver gå mot en instans på supabase.com. Se https://supabase.com/docs/guides/local-development för mer info.

- Skapa en fil som heter `.env` i projektets mapp och fyll den med följande:
  ```
  SUPABASE_URL=http://127.0.0.1:54321
  SUPABASE_ANON_KEY=abcde12345
  DEBUG=false
  ```

  Se till att datan matchar värdena för din lokala Supabase-instans. Du kan hitta dem genom att köra
  ``` 
  npx supabase status
  ```
- Nu kan du köra
  ```
  npm run start
  ```
  och komma åt lajvstart lokalt i din webbläsare. Skapa en användare genom UI:t och börja utveckla!

  ### Migrationer och typer

  Om du gör några ändringar i databasen lokalt (som att lägga till en ny kolumn eller tabell) behöver du uppdatera typerna så att man får korrekt autocompletion direkt från databaslagret. Kör:
  ```
  npm run types
  ```
  För att ändringen även skall appliceras på produktionsdatabasen måste du skapa en migration. Kör följande och använd ett migrationsnamn som beskriver ändringen:
  ```
  npm run migrate -- MIGRATIONSNAMN
  ```