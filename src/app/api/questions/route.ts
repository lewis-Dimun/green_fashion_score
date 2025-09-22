import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/server-auth'
import { UserRole } from '@prisma/client'

export async function GET(request: Request) {
  const { error } = await requireAuth(UserRole.ADMIN)
  if (error) return error

  const url = new URL(request.url)
  const pillarId = url.searchParams.get('pillarId') ?? undefined

  const questions = await prisma.question.findMany({
    where: pillarId ? { pillarId } : undefined,
    orderBy: { createdAt: 'asc' },
    include: { options: true, pillar: true },
  })

  return NextResponse.json(questions)
}

export async function POST(request: Request) {
  const { error } = await requireAuth(UserRole.ADMIN)
  if (error) return error

  try {
    const body = await request.json()
    const { text, maxPoints, pillarId } = body ?? {}

    if (!text || typeof maxPoints !== 'number' || !pillarId) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const question = await prisma.question.create({
      data: {
        text,
        maxPoints,
        pillarId,
      },
    })

    return NextResponse.json(question, { status: 201 })
  } catch (err) {
    console.error('Create question error:', err)
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 })
  }
}
