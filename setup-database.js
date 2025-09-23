const fs = require('fs')
const path = require('path')

console.log('Green Fashion Score · Environment bootstrap')

const envPath = path.join(__dirname, '.env.local')

if (!fs.existsSync(envPath)) {
  const envTemplate = `# Database
DATABASE_URL="postgresql://postgres:password@localhost:5433/green_fashion_score?schema=public"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-a-strong-random-string"
`

  try {
    fs.writeFileSync(envPath, envTemplate, { encoding: 'utf-8' })
    console.log('.env.local created with starter values. Update the credentials before production use.')
  } catch (error) {
    console.error('Failed to write .env.local automatically. Create it manually with the template below:')
    console.log(envTemplate)
    process.exit(1)
  }
} else {
  console.log('.env.local already present – skipping file creation.')
}

console.log('\nNext steps:')
console.log('1. Launch PostgreSQL (docker compose up -d).')
console.log('2. Apply migrations: npx prisma migrate deploy')
console.log('3. Seed baseline data: npm run db:seed')
console.log('4. Start the app: npm run dev')
