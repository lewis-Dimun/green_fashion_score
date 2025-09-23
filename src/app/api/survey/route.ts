import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/server-auth'
import { calculateUserScore } from '@/lib/scoring'
import { UserRole } from '@prisma/client'

export async function GET() {
  const { error, session } = await requireAuth(UserRole.USER)
  if (error) return error

  const pillars = await prisma.pillar.findMany({
    orderBy: { createdAt: 'asc' },
    include: {
      questions: {
        where: { isHidden: false },
        orderBy: { createdAt: 'asc' },
        include: {
          options: {
            orderBy: { points: 'desc' },
          },
        },
      },
    },
  })

  return NextResponse.json({ pillars, userId: session?.user.id })
}

export async function POST(request: Request) {
  const { error, session } = await requireAuth(UserRole.USER)
  if (error || !session) {
    return error ?? NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const responses = Array.isArray(body?.responses) ? body.responses : []

    if (responses.length === 0) {
      return NextResponse.json({ error: 'No responses provided' }, { status: 400 })
    }

    const sanitized = responses.filter(
      (entry: any) => typeof entry?.questionId === 'string' && typeof entry?.optionId === 'string'
    )

    if (sanitized.length === 0) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const optionIds = sanitized.map((item) => item.optionId)
    const options = await prisma.option.findMany({
      where: { id: { in: optionIds } },
      select: { id: true, points: true, questionId: true },
    })

    const optionById = new Map(options.map((opt) => [opt.id, opt]))
    const createData: { userId: string; questionId: string; optionId: string; score: number }[] = []
    const seenQuestionIds = new Set<string>()

    for (const entry of sanitized) {
      const option = optionById.get(entry.optionId)
      if (!option || option.questionId !== entry.questionId) {
        return NextResponse.json({ error: 'Invalid option selection' }, { status: 400 })
      }
      if (seenQuestionIds.has(option.questionId)) {
        return NextResponse.json({ error: 'Duplicate responses for question detected' }, { status: 400 })
      }
      seenQuestionIds.add(option.questionId)
      createData.push({
        userId: session.user.id,
        questionId: option.questionId,
        optionId: option.id,
        score: Number(option.points ?? 0),
      })
    }

    const questionIds = Array.from(new Set(createData.map((item) => item.questionId)))

    await prisma.$transaction(async (tx) => {
      if (questionIds.length > 0) {
        await tx.response.deleteMany({
          where: {
            userId: session.user.id,
            questionId: { in: questionIds },
          },
        })
      } else {
        await tx.response.deleteMany({
          where: { userId: session.user.id },
        })
      }

      if (createData.length > 0) {
        await tx.response.createMany({ data: createData })
      }
    })

    const scoring = await calculateUserScore(session.user.id)

    return NextResponse.json(scoring, { status: 201 })
  } catch (err) {
    console.error('Submit survey error:', err)
    return NextResponse.json({ error: 'Failed to submit survey' }, { status: 500 })
  }
}






