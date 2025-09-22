# Green Fashion Score

A Next.js application with TypeScript, TailwindCSS, Prisma, PostgreSQL, NextAuth.js, and Chart.js for data visualization.

## Features

- ✅ Next.js 15 with TypeScript
- ✅ TailwindCSS for styling
- ✅ Prisma ORM with PostgreSQL
- ✅ NextAuth.js authentication with role-based access control
- ✅ Chart.js for data visualization
- ✅ Modern UI/UX design

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/green_fashion_score?schema=public"
   
   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"
   
   # OAuth Providers (not used - email/password only)
   # GOOGLE_CLIENT_ID="your-google-client-id"
   # GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # GITHUB_CLIENT_ID="your-github-client-id"
   # GITHUB_CLIENT_SECRET="your-github-client-secret"
   ```

4. Set up the database:
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # Dashboard pages
│   ├── charts/         # Charts pages
│   └── globals.css     # Global styles
├── components/         # Reusable components
├── lib/               # Utility functions
└── types/             # TypeScript type definitions
```

## Authentication

The application uses NextAuth.js with the following features:
- Email/password authentication only
- Role-based access control (Admin, User)
- Session management

## Database

The application uses Prisma with PostgreSQL and includes:
- User management with roles
- Fashion score tracking
- Session and account management for NextAuth.js

## Charts

Chart.js is integrated for data visualization with:
- Line charts
- Bar charts
- Pie charts
- Responsive design
