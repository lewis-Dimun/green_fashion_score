# Green Fashion Score

Next.js sustainability survey platform using TypeScript, Tailwind CSS, Prisma, PostgreSQL, NextAuth (credentials), and Chart.js.

## Features

- Next.js 15 App Router with TypeScript
- Tailwind CSS styling
- Prisma ORM with PostgreSQL
- NextAuth.js credentials provider with role-based sessions
- Admin dashboard and user-facing survey flows
- Chart.js visualisations

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

- Admin users are redirected to the management dashboard where survey content can be reviewed.
- User accounts are redirected to the survey experience. Attempting to access an admin area results in an "Access denied" page.

## Seeding & Content

- `prisma/seed.ts` parses `Resultados Green Fashion Score.xlsx` (pillars/questions/options) and upserts demo users. Update the XML payload inside the seed file or extend the parser to ingest other inputs.
- Re-run `npm run db:seed` whenever seeded data needs to be refreshed.

## Available Scripts

- `npm run dev` – Start Next.js in development mode
- `npm run build` – Production build
- `npm run start` – Serve the production build
- `npm run lint` – Run ESLint
- `npm run db:migrate` – Run Prisma migrations in dev mode
- `npm run db:generate` – Regenerate Prisma client
- `npm run db:push` – Push schema to the database (useful for prototypes)
- `npm run db:studio` – Launch Prisma Studio
- `npm run db:seed` – Run the TypeScript seed script

## Project Structure

```
src/
  app/
    api/                # API routes (register, next-auth)
    auth/               # Sign in / sign up pages
    dashboard/          # Admin-only management UI
    survey/             # User-facing survey experience
    unauthorized/       # Shared "no permission" page
    layout.tsx          # Root layout
    page.tsx            # Landing page
  components/           # Shared components
  lib/                  # Prisma client and NextAuth config
  types/                # NextAuth type augmentation
prisma/
  migrations/           # Prisma migrations
  schema.prisma         # Data model
  seed.ts               # XML-driven and user seed logic
```

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
