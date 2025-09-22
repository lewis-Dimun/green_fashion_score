const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create test users
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      name: 'Test User',
      email: 'test@example.com',
      role: 'USER',
      emailVerified: new Date(),
    },
  })

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })

  // Create some sample fashion scores
  const fashionScores = await Promise.all([
    prisma.fashionScore.upsert({
      where: { id: 'score-1' },
      update: {},
      create: {
        id: 'score-1',
        brand: 'Nike',
        score: 85.5,
        category: 'Sportswear',
        description: 'Good sustainability practices in manufacturing',
        userId: testUser.id,
      },
    }),
    prisma.fashionScore.upsert({
      where: { id: 'score-2' },
      update: {},
      create: {
        id: 'score-2',
        brand: 'H&M',
        score: 72.0,
        category: 'Fast Fashion',
        description: 'Improving but still has room for growth',
        userId: testUser.id,
      },
    }),
    prisma.fashionScore.upsert({
      where: { id: 'score-3' },
      update: {},
      create: {
        id: 'score-3',
        brand: 'Patagonia',
        score: 95.0,
        category: 'Outdoor',
        description: 'Excellent environmental and social practices',
        userId: adminUser.id,
      },
    }),
  ])

  console.log('✅ Database seeded successfully!')
  console.log('\n📋 Test Accounts Created:')
  console.log('👤 Regular User:')
  console.log('   Email: test@example.com')
  console.log('   Password: any password (demo mode)')
  console.log('   Role: USER')
  console.log('\n👑 Admin User:')
  console.log('   Email: admin@example.com')
  console.log('   Password: any password (demo mode)')
  console.log('   Role: ADMIN')
  console.log('\n📊 Sample fashion scores created:', fashionScores.length)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

