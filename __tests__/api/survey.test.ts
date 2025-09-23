import { NextResponse } from 'next/server'
import { GET, POST } from '@/app/api/survey/route'
import { requireAuth } from '@/lib/server-auth'
import { prisma } from '@/lib/prisma'
import { calculateUserScore } from '@/lib/scoring'
import { UserRole } from '@prisma/client'

jest.mock('@/lib/server-auth', () => ({
  requireAuth: jest.fn(),
}))

jest.mock('@/lib/prisma', () => ({
  prisma: {
    pillar: {
      findMany: jest.fn(),
    },
    option: {
      findMany: jest.fn(),
    },
    response: {
      deleteMany: jest.fn(),
      createMany: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}))

jest.mock('@/lib/scoring', () => ({
  calculateUserScore: jest.fn(),
}))

const mockRequireAuth = requireAuth as jest.MockedFunction<typeof requireAuth>
const mockPillar = prisma.pillar as jest.Mocked<typeof prisma.pillar>
const mockOption = prisma.option as jest.Mocked<typeof prisma.option>
const mockResponse = prisma.response as jest.Mocked<typeof prisma.response>
const mockTransaction = prisma.$transaction as jest.Mock
const mockScoring = calculateUserScore as jest.MockedFunction<typeof calculateUserScore>

describe('Survey API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockTransaction.mockImplementation(async (callback) => callback({ response: mockResponse }))
  })

  describe('GET /api/survey', () => {
    it('returns 401 when unauthorized', async () => {
      mockRequireAuth.mockResolvedValue({
        error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
        session: null,
      } as any)

      const res = await GET()

      expect(res.status).toBe(401)
    })

    it('returns pillars for authenticated user', async () => {
      mockRequireAuth.mockResolvedValue({
        error: null,
        session: { user: { id: 'user-1', role: UserRole.USER } },
      } as any)
      const pillars = [{ id: 'p1', name: 'People', questions: [] }]
      mockPillar.findMany.mockResolvedValue(pillars as any)

      const res = await GET()
      const body = await res.json()

      expect(mockRequireAuth).toHaveBeenCalledWith(UserRole.USER)
      expect(body).toEqual({ pillars, userId: 'user-1' })
    })
  })

  describe('POST /api/survey', () => {
    const sessionPayload = {
      error: null,
      session: { user: { id: 'user-1', role: UserRole.USER } },
    } as any

    it('rejects invalid payload', async () => {
      mockRequireAuth.mockResolvedValue(sessionPayload)

      const req = new Request('http://localhost/api/survey', {
        method: 'POST',
        body: JSON.stringify({ responses: [] }),
      })

      const res = await POST(req)
      const body = await res.json()

      expect(res.status).toBe(400)
      expect(body.error).toBe('No responses provided')
    })

    it('persists responses and returns scoring result', async () => {
      mockRequireAuth.mockResolvedValue(sessionPayload)
      mockOption.findMany.mockResolvedValue([
        { id: 'opt-1', questionId: 'q1', points: 4 },
      ] as any)
      mockScoring.mockResolvedValue({ totalScore: 1, breakdown: [], responses: [] })

      const req = new Request('http://localhost/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses: [{ questionId: 'q1', optionId: 'opt-1' }] }),
      })

      const res = await POST(req)
      const body = await res.json()

      expect(mockOption.findMany).toHaveBeenCalledWith({
        where: { id: { in: ['opt-1'] } },
        select: { id: true, points: true, questionId: true },
      })
      expect(mockTransaction).toHaveBeenCalled()
      expect(mockResponse.deleteMany).toHaveBeenCalledWith({
        where: {
          userId: 'user-1',
          questionId: { in: ['q1'] },
        },
      })
      expect(mockResponse.createMany).toHaveBeenCalledWith({
        data: [{ userId: 'user-1', questionId: 'q1', optionId: 'opt-1', score: 4 }],
      })
      expect(mockScoring).toHaveBeenCalledWith('user-1')
      expect(res.status).toBe(201)
      expect(body).toEqual({ totalScore: 1, breakdown: [], responses: [] })
    })
  })
})
