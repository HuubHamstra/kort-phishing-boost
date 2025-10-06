# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/92b6d15d-14a0-49b8-90b9-b1edc03b6b52

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/92b6d15d-14a0-49b8-90b9-b1edc03b6b52) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Supabase (Training Resultaten Opslag)

De app kan trainingsresultaten opslaan in Supabase. Maak eerst een project op https://supabase.com en voeg de volgende environment variabelen toe aan je Vite omgeving (bijv. `.env.local`):

```
VITE_SUPABASE_URL=https://<YOUR_PROJECT>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<YOUR_ANON_KEY>
```

### Database tabel aanmaken

Voer onder SQL in Supabase het volgende script uit om de `training_results` tabel te maken:

```sql
create table if not exists public.training_results (
	id uuid primary key default gen_random_uuid(),
	created_at timestamptz default now(),
	session_id uuid null,
	score int not null,
	total_questions int not null,
	percentage int not null,
	answers jsonb null
);

-- (optioneel) Row Level Security en policies
alter table public.training_results enable row level security;

-- Sta alleen inserts toe (publiek) als je geen auth gebruikt
create policy "allow insert training results" on public.training_results
	for insert
	to anon
	with check (true);

-- Sta select toe indien je later dashboards wilt bouwen (optioneel)
create policy "allow read training results" on public.training_results
	for select
	to anon
	using (true);
```

Let op: Voor productie wil je waarschijnlijk authenticated users koppelen en de policies strenger maken.

### Types regenereren (optioneel)

De `src/integrations/supabase/types.ts` is nu handmatig uitgebreid. Je kunt deze automatisch genereren met de Supabase CLI:

```bash
npm install -g supabase
supabase login
supabase link --project-ref <YOUR_PROJECT_REF>
supabase gen types typescript --schema public > src/integrations/supabase/types.ts
```

## Training Resultaat Opslag Flow

Wanneer een gebruiker de phishing training afrondt:

1. Per vraag wordt het antwoord opgeslagen in state.
2. Bij het tonen van het resultaten scherm wordt éénmalig een insert gedaan naar `training_results`.
3. Bij succes verschijnt een toast melding.
4. Bij fout kan de gebruiker opnieuw proberen door de training opnieuw te starten.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/92b6d15d-14a0-49b8-90b9-b1edc03b6b52) and click on Share -> Publish.

### Deploy naar GitHub Pages

Je kunt deze Vite + React app automatisch deployen naar GitHub Pages met de meegeleverde workflow in `.github/workflows/deploy.yml`.

1. Zorg dat je repository publiek is OF dat GitHub Pages voor private repos (beta) geactiveerd is.
2. Ga in GitHub naar Settings → Pages en kies: Source: GitHub Actions.
3. Voeg (optioneel) Secrets toe voor Supabase indien je productie variabelen nodig hebt:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
4. Push naar `main` (of trigger handmatig via Actions tab). De workflow bouwt met Bun en publiceert naar Pages.

De site komt beschikbaar op: `https://<username>.github.io/<repository>/`.

#### SPA Routing (react-router)

GitHub Pages serveert standaard een 404 bij deep links (bijv. `/training`). Om dit op te vangen kun je een `404.html` kopie van `index.html` genereren. Voeg dit toe na de build stap indien nodig:

```bash
cp dist/index.html dist/404.html
```

Je kunt dit automatiseren door een extra stap toe te voegen in de workflow net vóór het uploaden van het artifact.

#### Lokale test met base pad

De `vite.config.ts` zet automatisch de `base` wanneer de env var `REPO_NAME` aanwezig is in production mode. Wil je lokaal testen:

```bash
REPO_NAME=kort-phishing-boost bun run build && npx serve dist
```

Browse dan naar `http://localhost:3000/kort-phishing-boost/` (afhankelijk van je static server).

#### Custom domein

Wil je een eigen domein koppelen? Maak een `CNAME` bestand in `public/` met de gewenste domeinnaam. Voorbeeld: `public/CNAME`:

```
phishing-training.example.com
```

De workflow zal het bestand meenemen in `dist/`. Configureer vervolgens een CNAME record bij je DNS provider dat naar `<username>.github.io` verwijst.

Gebruik je een custom domein (zoals `phishing-campaign.nl`) dan zet de build (via env `CUSTOM_DOMAIN`) de Vite `base` terug naar `/` zodat assets correct resolven vanaf de root i.p.v. `/<repo>/`.

DNS records voorbeeld (GitHub Pages):

| Type  | Naam | Waarde               |
| ----- | ---- | -------------------- |
| A     | @    | 185.199.108.153      |
| A     | @    | 185.199.109.153      |
| A     | @    | 185.199.110.153      |
| A     | @    | 185.199.111.153      |
| CNAME | www  | <username>.github.io |

Na configuratie: wacht (TTL) en verifieer in Settings → Pages → Custom domain. Voeg daarna (optioneel) HSTS / enforce HTTPS.

#### Cache busting

Vite genereert gehashte bestandsnamen, dus standaard werkt cache busting prima. Zorg dat je geen bestanden direct zonder hash referenced buiten `index.html`.

#### Problemen oplossen

| Probleem               | Oorzaak            | Oplossing                                       |
| ---------------------- | ------------------ | ----------------------------------------------- |
| Assets 404             | Verkeerde base     | Controleer dat `base` overeenkomt met repo naam |
| Deep link 404          | Geen SPA fallback  | Voeg `404.html` kopie toe                       |
| Supabase URL undefined | Secrets niet gezet | Voeg repo secrets toe en re-run workflow        |

Als iets ontbreekt of je wil optimaliseren (bv. compressie, preloading), open gerust een issue of vraag het.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
