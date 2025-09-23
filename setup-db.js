const { execSync } = require('child_process')

function runStep(message, command) {
  console.log(message)
  execSync(command, { stdio: 'inherit' })
}

try {
  if (!process.env.DATABASE_URL) {
    console.log('DATABASE_URL is not set. Configure your .env.local file before running this helper script.')
    process.exit(1)
  }

  runStep('\n1. Generating Prisma client...', 'npx prisma generate')
  runStep('\n2. Applying migrations...', 'npx prisma migrate deploy')
  runStep('\n3. Seeding baseline data...', 'npm run db:seed')

  console.log('\nDatabase setup complete. You can now run: npm run dev')
} catch (error) {
  console.error('\nDatabase setup failed:', error?.message ?? error)
  console.log('\nTroubleshooting tips:')
  console.log('- Ensure PostgreSQL is reachable at the URL defined in DATABASE_URL.')
  console.log('- If you are using Docker: docker compose up -d && docker ps')
  console.log('- Inspect logs: docker logs green-fashion-postgres')
  process.exit(1)
}
