import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/server-auth'
import { UserRole } from '@prisma/client'

interface Params {
  params: { id: string }
}

export async function GET(_request: Request, { params }: Params) {
  const { error } = await requireAuth(UserRole.ADMIN)
  if (error) return error

  const result = await prisma.surveyResult.findUnique({
    where: { id: params.id },
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

  if (!result) {
    return NextResponse.json({ error: 'Result not found' }, { status: 404 })
  }

  return NextResponse.json(result)
}
