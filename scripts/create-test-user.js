const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createTestUser() {
  try {
    // Create a test user
    const testUser = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        role: 'USER',
        emailVerified: new Date(),
      },
    })

    console.log('✅ Test user created successfully:')
    console.log('Email: test@example.com')
    console.log('Password: password123')
    console.log('Role: USER')
    console.log('User ID:', testUser.id)
    
    // Also create an admin user
    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'ADMIN',
        emailVerified: new Date(),
      },
    })

    console.log('\n✅ Admin user created successfully:')
    console.log('Email: admin@example.com')
    console.log('Password: password123')
    console.log('Role: ADMIN')
    console.log('User ID:', adminUser.id)

    console.log('\n📝 Note: For demo purposes, any password will work with these accounts.')
    console.log('In production, you should implement proper password hashing and verification.')

  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️  Users already exist with these email addresses.')
      console.log('You can use these existing accounts:')
      console.log('Email: test@example.com, Password: any password')
      console.log('Email: admin@example.com, Password: any password')
    } else {
      console.error('❌ Error creating test user:', error)
    }
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser()

