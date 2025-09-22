import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/server-auth'
import { UserRole } from '@prisma/client'

export async function GET() {
  const { error } = await requireAuth(UserRole.ADMIN)
  if (error) return error

  const results = await prisma.surveyResult.findMany({
    orderBy: { createdAt: 'desc' },
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

  return NextResponse.json(results)
}
