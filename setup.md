# Setup Instructions

## Environment Variables

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

## Database Setup

1. Make sure PostgreSQL is running
2. Create a database named `green_fashion_score`
3. Run the following commands:

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Create test users (optional)
npm run db:seed
```

## Running the Application

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

## Available Routes

- `/` - Home page
- `/auth/signin` - Sign in page
- `/dashboard` - Protected dashboard (requires authentication)
- `/charts` - Charts and analytics page (requires authentication)

## Features

- ✅ Next.js 15 with TypeScript
- ✅ TailwindCSS for styling
- ✅ Prisma ORM with PostgreSQL
- ✅ NextAuth.js with role-based authentication
- ✅ Chart.js for data visualization
- ✅ Modern UI/UX design

## User Roles

- `ADMIN` - Full access to all features
- `USER` - Standard user access

## Test Users

After running `npm run db:seed`, you can use these test accounts:

### Regular User
- **Email**: `test@example.com`
- **Password**: Any password (demo mode)
- **Role**: USER

### Admin User
- **Email**: `admin@example.com`
- **Password**: Any password (demo mode)
- **Role**: ADMIN

**Note**: In demo mode, any password will work for authentication. For production, implement proper password verification.

See `TEST-USERS.md` for more detailed information about test users and sample data.
