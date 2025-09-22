const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

console.log('🔧 Green Fashion Score - Database Setup Options\n')

console.log('Choose your preferred database setup method:\n')
console.log('1. 🐳 Docker (Requires Docker Desktop installation)')
console.log('2. ☁️  Supabase Cloud Database (Free, no installation)')
console.log('3. 🌟 Neon Cloud Database (Free, no installation)')
console.log('4. 🗄️  Local PostgreSQL (Requires PostgreSQL installation)')
console.log('5. ❓ Show me all options with details\n')

rl.question('Enter your choice (1-5): ', (answer) => {
  switch(answer.trim()) {
    case '1':
      console.log('\n🐳 Docker Setup:')
      console.log('1. Install Docker Desktop: https://www.docker.com/products/docker-desktop')
      console.log('2. Run: docker compose up -d')
      console.log('3. Run: npm run db:generate && npm run db:push && npm run db:seed')
      break
      
    case '2':
      console.log('\n☁️  Supabase Setup:')
      console.log('1. Go to: https://supabase.com')
      console.log('2. Create account and new project')
      console.log('3. Get connection string from Settings > Database')
      console.log('4. Update .env.local with your Supabase URL')
      console.log('5. Run: npm run db:generate && npm run db:push && npm run db:seed')
      console.log('\n📖 Detailed guide: CLOUD-DATABASE-SETUP.md')
      break
      
    case '3':
      console.log('\n🌟 Neon Setup:')
      console.log('1. Go to: https://neon.tech')
      console.log('2. Create account and new project')
      console.log('3. Get connection string from dashboard')
      console.log('4. Update .env.local with your Neon URL')
      console.log('5. Run: npm run db:generate && npm run db:push && npm run db:seed')
      console.log('\n📖 Detailed guide: CLOUD-DATABASE-SETUP.md')
      break
      
    case '4':
      console.log('\n🗄️  Local PostgreSQL Setup:')
      console.log('1. Download PostgreSQL: https://www.postgresql.org/download/windows/')
      console.log('2. Install with default settings')
      console.log('3. Create database: CREATE DATABASE green_fashion_score;')
      console.log('4. Update .env.local with your PostgreSQL credentials')
      console.log('5. Run: npm run db:generate && npm run db:push && npm run db:seed')
      break
      
    case '5':
      console.log('\n📋 All Options Summary:')
      console.log('\n🐳 Docker (Recommended for developers):')
      console.log('   ✅ Easy setup, isolated environment')
      console.log('   ❌ Requires Docker installation')
      console.log('\n☁️  Supabase (Recommended for beginners):')
      console.log('   ✅ No installation, free tier, web interface')
      console.log('   ❌ Requires internet connection')
      console.log('\n🌟 Neon (Alternative cloud option):')
      console.log('   ✅ No installation, free tier, fast')
      console.log('   ❌ Requires internet connection')
      console.log('\n🗄️  Local PostgreSQL:')
      console.log('   ✅ Full control, no internet needed')
      console.log('   ❌ Requires installation and configuration')
      break
      
    default:
      console.log('\n❌ Invalid choice. Please run the script again and choose 1-5.')
  }
  
  console.log('\n🎯 After setup, test your application at: http://localhost:3000')
  console.log('📖 For detailed instructions, see: DATABASE-SETUP.md')
  
  rl.close()
})

