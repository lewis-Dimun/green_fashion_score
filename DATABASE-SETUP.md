# Database Setup Guide

## 🚨 Current Issue
You're getting a database connection error because PostgreSQL isn't set up yet.

## 🐳 Option 1: Docker (Recommended - Easiest)

### Step 1: Install Docker
- Download Docker Desktop from https://www.docker.com/products/docker-desktop
- Install and start Docker Desktop

### Step 2: Start PostgreSQL with Docker
```bash
# Start the database
docker-compose up -d

# Check if it's running
docker ps
```

### Step 3: Create Environment File
Create a file named `.env.local` in your project root with:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/green_fashion_score?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"
```

### Step 4: Set up the Database
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

---

## 🗄️ Option 2: Local PostgreSQL Installation

### Step 1: Install PostgreSQL
- Download from https://www.postgresql.org/download/windows/
- Install with default settings
- Remember the password you set for the 'postgres' user

### Step 2: Create Database
```sql
-- Connect to PostgreSQL and run:
CREATE DATABASE green_fashion_score;
```

### Step 3: Create Environment File
Create `.env.local` with your actual PostgreSQL credentials:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/green_fashion_score?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"
```

### Step 4: Set up the Database
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

---

## ☁️ Option 3: Cloud Database (Supabase/Neon)

### Using Supabase (Free tier available)
1. Go to https://supabase.com
2. Create a new project
3. Get your database URL from Settings > Database
4. Create `.env.local` with your Supabase URL:
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"
```

### Using Neon (Free tier available)
1. Go to https://neon.tech
2. Create a new project
3. Get your connection string
4. Create `.env.local` with your Neon URL

---

## 🔧 Quick Fix Commands

After setting up your database and `.env.local` file:

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Create test users
npm run db:seed

# Start the application
npm run dev
```

## 🧪 Test Your Setup

1. Go to http://localhost:3000
2. Click "Sign In"
3. Use test credentials:
   - Email: `test@example.com`
   - Password: any password
4. You should be able to access the dashboard and charts

## 🆘 Troubleshooting

### Port Already in Use
If you get port conflicts, change the port in docker-compose.yml:
```yaml
ports:
  - "5433:5432"  # Use port 5433 instead
```
Then update your DATABASE_URL to use port 5433.

### Permission Denied
Make sure Docker Desktop is running and you have permission to create containers.

### Connection Refused
- Check if PostgreSQL is running: `docker ps`
- Verify your DATABASE_URL is correct
- Make sure the database name exists
