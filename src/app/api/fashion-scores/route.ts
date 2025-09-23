import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function sanitizeText(value: unknown, allowEmpty = false) {
  if (typeof value !== 'string') return ''
  const trimmed = value.trim()
  if (!allowEmpty && trimmed.length === 0) {
    return ''
  }
  return trimmed
}

function toNumericScore(value: unknown) {
  if (typeof value === 'number') return value
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number.parseFloat(value)
    return Number.isFinite(parsed) ? parsed : Number.NaN
  }
  return Number.NaN
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const fashionScores = await prisma.fashionScore.findMany({
      where: session.user.role === 'ADMIN' ? undefined : { userId: session.user.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(fashionScores)
  } catch (error) {
    console.error('Error fetching fashion scores:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const brandName = sanitizeText(body?.brand)
    const categoryName = sanitizeText(body?.category)
    const numericScore = toNumericScore(body?.score)

    if (!brandName || !categoryName || Number.isNaN(numericScore)) {
      return NextResponse.json(
        { error: 'Missing or invalid fields' },
        { status: 400 },
      )
    }

    const clampedScore = Math.max(0, Math.min(100, numericScore))
    const description = sanitizeText(body?.description, true)
    const normalizedDescription = description.length > 0 ? description : null

    const fashionScore = await prisma.fashionScore.create({
      data: {
        brand: brandName,
        score: clampedScore,
        category: categoryName,
        description: normalizedDescription,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(fashionScore, { status: 201 })
  } catch (error) {
    console.error('Error creating fashion score:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
