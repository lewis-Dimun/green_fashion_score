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

  const pillar = await prisma.pillar.findUnique({
    where: { id },
    include: {
      questions: {
        include: {
          options: true,
        },
      },
    },
  })

  if (!pillar) {
    return NextResponse.json({ error: 'Pillar not found' }, { status: 404 })
  }

  return NextResponse.json(pillar)
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params
  const { error } = await requireAuth(UserRole.ADMIN)
  if (error) return error

  try {
    const body = await request.json()
    const { name, description, maxPoints, weight } = body ?? {}

    const pillar = await prisma.pillar.update({
      where: { id },
      data: {
        ...(name ? { name } : {}),
        description: description ?? null,
        ...(typeof maxPoints === 'number' ? { maxPoints } : {}),
        ...(typeof weight === 'number' ? { weight } : {}),
      },
    })

    return NextResponse.json(pillar)
  } catch (err) {
    console.error('Update pillar error:', err)
    return NextResponse.json({ error: 'Failed to update pillar' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params
  const { error } = await requireAuth(UserRole.ADMIN)
  if (error) return error

  try {
    await prisma.pillar.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Delete pillar error:', err)
    return NextResponse.json({ error: 'Failed to delete pillar' }, { status: 500 })
  }
}
