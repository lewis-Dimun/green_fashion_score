const { execSync } = require('child_process')

console.log('🔧 Setting up database...\n')

// Set environment variable
process.env.DATABASE_URL = 'postgresql://postgres:password@localhost:5432/green_fashion_score?schema=public'

try {
  console.log('1. Generating Prisma client...')
  execSync('npx prisma generate', { stdio: 'inherit' })
  
  console.log('\n2. Pushing database schema...')
  execSync('npx prisma db push', { stdio: 'inherit' })
  
  console.log('\n3. Seeding database with test users...')
  execSync('node prisma/seed.js', { stdio: 'inherit' })
  
  console.log('\n✅ Database setup complete!')
  console.log('\n🧪 Test accounts created:')
  console.log('   Email: test@example.com')
  console.log('   Email: admin@example.com')
  console.log('   Password: any password (demo mode)')
  console.log('\n🚀 You can now start the app with: npm run dev')
  
} catch (error) {
  console.error('\n❌ Error setting up database:', error.message)
  console.log('\n🔍 Troubleshooting:')
  console.log('1. Make sure Docker is running: docker ps')
  console.log('2. Check if PostgreSQL container is up: docker logs green-fashion-postgres')
  console.log('3. Try restarting the container: docker compose restart')
}
