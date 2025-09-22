import { NextResponse } from 'next/server'
import { GET, POST } from '@/app/api/pillars/route'
import { requireAuth } from '@/lib/server-auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

jest.mock('@/lib/server-auth', () => ({
  requireAuth: jest.fn(),
}))

jest.mock('@/lib/prisma', () => ({
  prisma: {
    pillar: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}))

const mockRequireAuth = requireAuth as jest.MockedFunction<typeof requireAuth>
const mockPillar = prisma.pillar as jest.Mocked<typeof prisma.pillar>

describe('Pillars API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('GET returns 401 when unauthorized', async () => {
    mockRequireAuth.mockResolvedValue({ error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), session: null })

    const res = await GET()

    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toBe('Unauthorized')
  })

  test('GET returns list of pillars for admin', async () => {
    const pillars = [{ id: 'pillar-1', name: 'People', description: null, maxPoints: 10, weight: 0.2 }]
    mockRequireAuth.mockResolvedValue({ error: null, session: { user: { role: UserRole.ADMIN } } } as any)
    mockPillar.findMany.mockResolvedValue(pillars as any)

    const res = await GET()

    expect(mockRequireAuth).toHaveBeenCalledWith(UserRole.ADMIN)
    expect(mockPillar.findMany).toHaveBeenCalled()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual(pillars)
  })

  test('POST creates pillar', async () => {
    mockRequireAuth.mockResolvedValue({ error: null, session: { user: { role: UserRole.ADMIN } } } as any)
    const payload = { name: 'Planet', description: 'Env pillar', maxPoints: 20, weight: 0.3 }
    mockPillar.create.mockResolvedValue({ id: 'pillar-2', ...payload } as any)

    const request = new Request('http://localhost/api/pillars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const res = await POST(request)

    expect(mockPillar.create).toHaveBeenCalledWith({
      data: {
        name: 'Planet',
        description: 'Env pillar',
        maxPoints: 20,
        weight: 0.3,
      },
    })
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body).toEqual({ id: 'pillar-2', ...payload })
  })
})
