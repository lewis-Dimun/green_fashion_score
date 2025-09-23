import { GET } from '@/app/api/results/me/route'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/server-auth'
import { calculateUserScore } from '@/lib/scoring'
import { UserRole } from '@prisma/client'

jest.mock('@/lib/server-auth', () => ({
  requireAuth: jest.fn(),
}))

jest.mock('@/lib/prisma', () => ({
  prisma: {
    surveyResult: {
      findUnique: jest.fn(),
    },
  },
}))

jest.mock('@/lib/scoring', () => ({
  calculateUserScore: jest.fn(),
}))

const mockRequireAuth = requireAuth as jest.MockedFunction<typeof requireAuth>
const mockSurveyResult = prisma.surveyResult as jest.Mocked<typeof prisma.surveyResult>
const mockScoring = calculateUserScore as jest.MockedFunction<typeof calculateUserScore>

describe('results/me API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('denies access when not authenticated', async () => {
    mockRequireAuth.mockResolvedValue({
      error: new Response(null, { status: 401 }),
      session: null,
    } as any)

    const res = await GET(new Request('http://localhost/api/results/me'))
    expect(res.status).toBe(401)
  })

  it('returns current user summary without query params', async () => {
    mockRequireAuth.mockResolvedValue({
      error: null,
      session: { user: { id: 'user-1', role: UserRole.USER } },
    } as any)
    mockScoring.mockResolvedValue({
      totalScore: 0.42,
      breakdown: [],
      responses: [],
    })
    mockSurveyResult.findUnique.mockResolvedValue({ id: 'sr-1', userId: 'user-1', createdAt: new Date().toISOString() } as any)

    const res = await GET(new Request('http://localhost/api/results/me'))
    const body = await res.json()

    expect(mockScoring).toHaveBeenCalledWith('user-1')
    expect(mockSurveyResult.findUnique).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
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
    expect(body).toEqual({
      userId: 'user-1',
      summary: { totalScore: 0.42, breakdown: [], responses: [] },
      result: { id: 'sr-1', userId: 'user-1', createdAt: expect.any(String) },
    })
  })

  it('allows admin override via userId query', async () => {
    mockRequireAuth.mockResolvedValue({
      error: null,
      session: { user: { id: 'admin-1', role: UserRole.ADMIN } },
    } as any)
    mockScoring.mockResolvedValue({ totalScore: 0.9, breakdown: [], responses: [] })
    mockSurveyResult.findUnique.mockResolvedValue(null as any)

    const res = await GET(new Request('http://localhost/api/results/me?userId=user-2'))
    const body = await res.json()

    expect(mockScoring).toHaveBeenCalledWith('user-2')
    expect(body.userId).toBe('user-2')
  })
})
