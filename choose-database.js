const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

console.log('Green Fashion Score · Database options\n')
console.log('Choose a setup path:')
console.log('1. Docker (local container)')
console.log('2. Supabase (managed Postgres)')
console.log('3. Neon (managed Postgres)')
console.log('4. Local PostgreSQL installation')
console.log('5. Show comparison summary\n')

rl.question('Enter your choice (1-5): ', (answer) => {
  switch (answer.trim()) {
    case '1':
      console.log('\nDocker setup:')
      console.log('1. Install Docker Desktop: https://www.docker.com/products/docker-desktop')
      console.log('2. Run: docker compose up -d')
      console.log('3. Run: npx prisma migrate deploy')
      console.log('4. Run: npm run db:seed')
      break
    case '2':
      console.log('\nSupabase setup:')
      console.log('1. Visit https://supabase.com and create a project')
      console.log('2. Copy the Postgres connection string (Settings > Database)')
      console.log('3. Update DATABASE_URL inside .env.local')
      console.log('4. Run: npx prisma migrate deploy && npm run db:seed')
      break
    case '3':
      console.log('\nNeon setup:')
      console.log('1. Visit https://neon.tech and create a project')
      console.log('2. Copy the connection string (use the pooled URL)')
      console.log('3. Update DATABASE_URL inside .env.local')
      console.log('4. Run: npx prisma migrate deploy && npm run db:seed')
      break
    case '4':
      console.log('\nLocal PostgreSQL setup:')
      console.log('1. Install PostgreSQL: https://www.postgresql.org/download/')
      console.log('2. Create a database named green_fashion_score')
      console.log('3. Update DATABASE_URL inside .env.local')
      console.log('4. Run: npx prisma migrate deploy && npm run db:seed')
      break
    case '5':
      console.log('\nSummary:')
      console.log('- Docker: best local developer experience, requires Docker Desktop')
      console.log('- Supabase: managed Postgres with generous free tier, needs internet')
      console.log('- Neon: managed serverless Postgres, great for prototypes, needs internet')
      console.log('- Local PostgreSQL: full control, but manual installation & maintenance')
      break
    default:
      console.log('\nInvalid choice. Please run the script again and choose 1-5.')
      break
  }

  console.log('\nOnce your database is ready, test the app at http://localhost:3000')
  rl.close()
})
