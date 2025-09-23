# Green Fashion Score

Next.js sustainability survey platform using TypeScript, Tailwind CSS, Prisma, PostgreSQL, NextAuth (credentials), and Chart.js.

## Features

- Next.js 15 App Router with TypeScript
- Tailwind CSS styling and Chart.js data visualisations
- Prisma ORM with PostgreSQL and NextAuth credentials authentication
- Role-aware dashboards: admin survey builder & user-specific analytics
- Transactional survey submission with weighted KPI scoring
- XML-driven content seeding (editable via `prisma/data/initial-survey.xml`)

## Getting Started


### Prerequisites

- Node.js 18+
- PostgreSQL 15 (local or hosted)
- npm (comes with Node.js)

### Installation

1. Clone the repository and install dependencies
   ```bash
   npm install
   ```

2. Set up environment variables in `.env.local`
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5433/green_fashion_score?schema=public"

   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="replace-with-a-strong-random-string"
   ```

3. Start PostgreSQL (for the included Docker setup)
   ```bash
   docker compose up -d
   ```

4. Apply database migrations and seed baseline data (pillars, questions, default users)
   ```bash
   npx prisma migrate dev
   npm run db:seed
   ```

5. Start the development server
   ```bash
   npm run dev
   ```

Visit http://localhost:3000 to access the app.

## Default Accounts

The seed script creates two credential-based users:

| Role  | Email             | Password  | Access                     |
|-------|-------------------|-----------|----------------------------|
| ADMIN | admin@example.com | Admin123! | `/dashboard` management UI |
| USER  | user@example.com  | User123!  | `/survey` questionnaire UI |

- Admin accounts land on the management dashboard to maintain survey content, review submissions, and access portfolio analytics.
- User accounts land on their personal dashboard (`/dashboard`) where they can review scores while `/survey` remains available for edits.

## Seeding & Content

- `prisma/seed.ts` ingests the editable XML file at `prisma/data/initial-survey.xml` and upserts demo users.
- Update or replace the XML document to evolve pillars, questions, and options, then run `npm run db:seed` to refresh the catalog.

## Available Scripts

- `npm run dev` - Start Next.js in development mode
- `npm run build` - Production build
- `npm run start` - Serve the production build
- `npm run lint` - Run ESLint
- `npm run db:migrate` - Run Prisma migrations in dev mode
- `npm run db:generate` - Regenerate Prisma client
- `npm run db:push` - Push schema to the database (useful for prototypes)
- `npm run db:studio` - Launch Prisma Studio
- `npm run db:seed` - Run the TypeScript seed script
- `npm test` - Run Jest integration/unit tests

## Project Structure

```
src/
  app/
    api/                # API routes (auth, survey, management, analytics)
    auth/               # Sign in / sign up pages
    charts/             # Server-guarded analytics landing
    dashboard/          # Admin builder + user analytics dashboards
    survey/             # User-facing survey experience
    unauthorized/       # Shared "no permission" page
    layout.tsx          # Root layout
    page.tsx            # Landing page
  components/           # Shared components
  lib/                  # Prisma client, auth config, scoring helpers
  types/                # NextAuth type augmentation
prisma/
  data/                 # XML survey seed inputs
  migrations/           # Prisma migrations
  schema.prisma         # Data model
  seed.ts               # XML-driven seed logic
```



## Protected API Endpoints

**Admin only**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/pillars | List pillars (with questions) |
| POST   | /api/pillars | Create pillar |
| GET    | /api/pillars/:id | Retrieve pillar detail |
| PUT    | /api/pillars/:id | Update pillar |
| DELETE | /api/pillars/:id | Delete pillar |
| GET    | /api/questions | List questions (filter by pillar) |
| POST   | /api/questions | Create question |
| GET    | /api/questions/:id | Retrieve question detail |
| PUT    | /api/questions/:id | Update question |
| DELETE | /api/questions/:id | Delete question |
| GET    | /api/options | List options (filter by question) |
| POST   | /api/options | Create option |
| GET    | /api/options/:id | Retrieve option detail |
| PUT    | /api/options/:id | Update option |
| DELETE | /api/options/:id | Delete option |
| GET    | /api/results | List survey results |
| GET    | /api/results/:id | Retrieve result detail |
| GET    | /api/fashion-scores | Portfolio scores across users |

**User scoped**

| Method | Endpoint        | Description |
|--------|-----------------|-------------|
| GET    | /api/results/me | Retrieve the caller's survey result and responses |
| GET    | /api/fashion-scores | List only the caller's fashion scores |

Middleware guards (middleware.ts) enforce these role checks while /survey is restricted to authenticated USER accounts.

## Survey Submission API

Accessible to authenticated `USER` accounts.

| Method | Endpoint     | Description                              |
|--------|--------------|------------------------------------------|
| GET    | /api/survey  | Fetch visible pillars, questions, options |
| POST   | /api/survey  | Persist responses and execute scoring     |

## Authentication & Roles

- Credentials provider (email + password) with bcrypt hashing
- Roles persisted in the `User` model (`ADMIN`, `USER`)
- Middleware guards sensitive routes (`/dashboard` for admins, `/survey` for users)
- Sessions expose `session.user.role` for client-side checks

## Database Notes

- The default Docker setup exposes PostgreSQL on port `5433`.
- Use `npm run db:studio` to inspect pillars, questions, options, and users.
- Adjust the XML seed dataset or create additional migrations as your survey evolves.

Happy auditing! :seedling:





