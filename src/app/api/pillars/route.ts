import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/server-auth'
import { UserRole } from '@prisma/client'

export async function GET() {
  const { error } = await requireAuth(UserRole.ADMIN)
  if (error) return error

  const pillars = await prisma.pillar.findMany({
    orderBy: { createdAt: 'asc' },
    include: {
      questions: {
        include: {
          options: true,
        },
      },
    },
  })

  return NextResponse.json(pillars)
}

export async function POST(request: Request) {
  const { error } = await requireAuth(UserRole.ADMIN)
  if (error) return error

  try {
    const body = await request.json()
    const { name, description, maxPoints, weight } = body ?? {}

    if (!name || typeof maxPoints !== 'number' || typeof weight !== 'number') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const pillar = await prisma.pillar.create({
      data: {
        name,
        description: description ?? null,
        maxPoints,
        weight,
      },
    })

    return NextResponse.json(pillar, { status: 201 })
  } catch (err) {
    console.error('Create pillar error:', err)
    return NextResponse.json({ error: 'Failed to create pillar' }, { status: 500 })
  }
}
