const fs = require('fs')
const path = require('path')

console.log('🔧 Green Fashion Score - Database Setup Helper\n')

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local')
const envExists = fs.existsSync(envPath)

if (!envExists) {
  console.log('📝 Creating .env.local file...')
  
  const envContent = `# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/green_fashion_score?schema=public"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"
`

  try {
    fs.writeFileSync(envPath, envContent)
    console.log('✅ .env.local file created successfully!')
  } catch (error) {
    console.log('❌ Error creating .env.local file:', error.message)
    console.log('\n📋 Please create .env.local manually with this content:')
    console.log(envContent)
  }
} else {
  console.log('✅ .env.local file already exists')
}

console.log('\n🐳 Next steps:')
console.log('1. Start PostgreSQL database:')
console.log('   docker-compose up -d')
console.log('\n2. Set up the database:')
console.log('   npm run db:generate')
console.log('   npm run db:push')
console.log('   npm run db:seed')
console.log('\n3. Start the application:')
console.log('   npm run dev')
console.log('\n📖 For detailed instructions, see DATABASE-SETUP.md')
