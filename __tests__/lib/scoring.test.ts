import { calculateUserScore } from '@/lib/scoring'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    response: {
      findMany: jest.fn(),
    },
    surveyResult: {
      upsert: jest.fn(),
    },
  },
}))

const mockResponse = prisma.response as jest.Mocked<typeof prisma.response>
const mockSurveyResult = prisma.surveyResult as jest.Mocked<typeof prisma.surveyResult>

describe('calculateUserScore', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns zero score and persists empty breakdown when no responses', async () => {
    mockResponse.findMany.mockResolvedValue([] as any)
    mockSurveyResult.upsert.mockResolvedValue({ id: 'r1', totalScore: 0 } as any)

    const result = await calculateUserScore('user-1')

    expect(mockSurveyResult.upsert).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      update: { totalScore: 0, breakdown: [] },
      create: { userId: 'user-1', totalScore: 0, breakdown: [] },
    })
    expect(result).toEqual({ totalScore: 0, breakdown: [] })
  })

  it('aggregates responses by pillar and stores weighted score', async () => {
    mockResponse.findMany.mockResolvedValue([
      {
        score: 6,
        question: {
          pillar: {
            id: 'p1',
            name: 'People',
            maxPoints: 10,
            weight: 0.4,
          },
        },
      },
      {
        score: 4,
        question: {
          pillar: {
            id: 'p2',
            name: 'Planet',
            maxPoints: 5,
            weight: 0.6,
          },
        },
      },
    ] as any)

    mockSurveyResult.upsert.mockResolvedValue({ id: 'res-1' } as any)

    const result = await calculateUserScore('user-2')

    const expectedBreakdown = [
      {
        pillarId: 'p1',
        pillarName: 'People',
        obtained: 6,
        maxPoints: 10,
        weight: 0.4,
        weightedScore: (0.4 / 10) * 6,
      },
      {
        pillarId: 'p2',
        pillarName: 'Planet',
        obtained: 4,
        maxPoints: 5,
        weight: 0.6,
        weightedScore: (0.6 / 5) * 4,
      },
    ]

    const totalScore = expectedBreakdown.reduce((sum, item) => sum + item.weightedScore, 0)

    expect(mockSurveyResult.upsert).toHaveBeenCalledWith({
      where: { userId: 'user-2' },
      update: { totalScore, breakdown: expectedBreakdown },
      create: { userId: 'user-2', totalScore, breakdown: expectedBreakdown },
    })

    expect(result.totalScore).toBeCloseTo(totalScore)
    expect(result.breakdown).toEqual(expect.arrayContaining(expectedBreakdown))
  })
})
