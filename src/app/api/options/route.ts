import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/server-auth'
import { UserRole } from '@prisma/client'

export async function GET(request: Request) {
  const { error } = await requireAuth(UserRole.ADMIN)
  if (error) return error

  const url = new URL(request.url)
  const questionId = url.searchParams.get('questionId') ?? undefined

  const options = await prisma.option.findMany({
    where: questionId ? { questionId } : undefined,
    orderBy: { points: 'desc' },
  })

  return NextResponse.json(options)
}

export async function POST(request: Request) {
  const { error } = await requireAuth(UserRole.ADMIN)
  if (error) return error

  try {
    const body = await request.json()
    const { label, points, questionId } = body ?? {}

    if (!label || typeof points !== 'number' || !questionId) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const option = await prisma.option.create({
      data: {
        label,
        points,
        questionId,
      },
    })

    return NextResponse.json(option, { status: 201 })
  } catch (err) {
    console.error('Create option error:', err)
    return NextResponse.json({ error: 'Failed to create option' }, { status: 500 })
  }
}
