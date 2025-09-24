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

  const option = await prisma.option.findUnique({
    where: { id },
  })

  if (!option) {
    return NextResponse.json({ error: 'Option not found' }, { status: 404 })
  }

  return NextResponse.json(option)
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params
  const { error } = await requireAuth(UserRole.ADMIN)
  if (error) return error

  try {
    const body = await request.json()
    const { label, points } = body ?? {}

    const option = await prisma.option.update({
      where: { id },
      data: {
        ...(label ? { label } : {}),
        ...(typeof points === 'number' ? { points } : {}),
      },
    })

    return NextResponse.json(option)
  } catch (err) {
    console.error('Update option error:', err)
    return NextResponse.json({ error: 'Failed to update option' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params
  const { error } = await requireAuth(UserRole.ADMIN)
  if (error) return error

  try {
    await prisma.option.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Delete option error:', err)
    return NextResponse.json({ error: 'Failed to delete option' }, { status: 500 })
  }
}
