import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/server-auth'
import { UserRole } from '@prisma/client'

interface Params {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params
  const { error } = await requireAuth(UserRole.ADMIN)
  if (error) return error

  const question = await prisma.question.findUnique({
    where: { id },
    include: { options: true, pillar: true },
  })

  if (!question) {
    return NextResponse.json({ error: 'Question not found' }, { status: 404 })
  }

  return NextResponse.json(question)
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params
  const { error } = await requireAuth(UserRole.ADMIN)
  if (error) return error

  try {
    const body = await request.json()
    const { text, maxPoints, pillarId, isHidden } = body ?? {}

    const question = await prisma.question.update({
      where: { id },
      data: {
        ...(text ? { text } : {}),
        ...(typeof maxPoints === 'number' ? { maxPoints } : {}),
        ...(pillarId ? { pillarId } : {}),
        ...(typeof isHidden === 'boolean' ? { isHidden } : {}),
      },
    })

    return NextResponse.json(question)
  } catch (err) {
    console.error('Update question error:', err)
    return NextResponse.json({ error: 'Failed to update question' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params
  const { error } = await requireAuth(UserRole.ADMIN)
  if (error) return error

  try {
    await prisma.question.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Delete question error:', err)
    return NextResponse.json({ error: 'Failed to delete question' }, { status: 500 })
  }
}
