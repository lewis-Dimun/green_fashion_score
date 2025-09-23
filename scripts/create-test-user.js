const { PrismaClient, UserRole } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function upsertUser({ email, name, role, password }) {
  const hashedPassword = await bcrypt.hash(password, 12)

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      role,
      password: hashedPassword,
    },
    create: {
      email,
      name,
      role,
      password: hashedPassword,
    },
  })

  return user
}

async function main() {
  try {
    console.log('Creating demo users (idempotent)...')

    const standard = await upsertUser({
      email: 'test@example.com',
      name: 'Test User',
      role: UserRole.USER,
      password: 'password123',
    })

    const admin = await upsertUser({
      email: 'admin@example.com',
      name: 'Admin User',
      role: UserRole.ADMIN,
      password: 'password123',
    })

    console.log('User accounts ready:')
    console.log('- USER  : test@example.com / password123 (id:', standard.id + ')')
    console.log('- ADMIN : admin@example.com / password123 (id:', admin.id + ')')
    console.log('\nPasswords are hashed with bcrypt. Update them before going to production.')
  } catch (error) {
    console.error('Failed to create demo users:', error)
    process.exitCode = 1
  } finally {
    await prisma.$disconnect()
  }
}

main()

