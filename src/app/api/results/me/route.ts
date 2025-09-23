import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/server-auth'
import { calculateUserScore } from '@/lib/scoring'
import { UserRole } from '@prisma/client'

export async function GET(request: Request) {
  const { error, session } = await requireAuth([UserRole.USER, UserRole.ADMIN])
  if (error || !session) {
    return error ?? NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(request.url)
  const requestedUserId = url.searchParams.get('userId') ?? undefined

  const isAdmin = session.user.role === UserRole.ADMIN
  const resolvedUserId = isAdmin && requestedUserId ? requestedUserId : session.user.id

  if (!isAdmin && requestedUserId && requestedUserId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const summary = await calculateUserScore(resolvedUserId)
  const result = await prisma.surveyResult.findUnique({
    where: { userId: resolvedUserId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      },
    },
  })

  return NextResponse.json({
    userId: resolvedUserId,
    summary,
    result,
  })
}
