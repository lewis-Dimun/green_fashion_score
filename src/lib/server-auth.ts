import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { UserRole } from '@prisma/client'
import { authOptions } from './auth'

export type AuthorizedSession = Awaited<ReturnType<typeof getServerSession>>

function normalizeRoles(roles?: UserRole | UserRole[]) {
  if (!roles) return []
  return Array.isArray(roles) ? roles : [roles]
}

export async function requireAuth(allowedRoles?: UserRole | UserRole[]) {
  const roles = normalizeRoles(allowedRoles)
  const session = await getServerSession(authOptions)

  if (!session) {
    return {
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
      session: null,
    }
  }

  const role = session.user.role as UserRole | undefined
  if (roles.length > 0 && (!role || !roles.includes(role))) {
    return {
      error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
      session: null,
    }
  }

  return { error: null, session }
}
