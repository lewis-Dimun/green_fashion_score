import { calculateUserScore } from '@/lib/scoring'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    pillar: {
      findMany: jest.fn(),
    },
    response: {
      findMany: jest.fn(),
    },
    surveyResult: {
      upsert: jest.fn(),
    },
  },
}))

const mockPillar = prisma.pillar as jest.Mocked<typeof prisma.pillar>
const mockResponse = prisma.response as jest.Mocked<typeof prisma.response>
const mockSurveyResult = prisma.surveyResult as jest.Mocked<typeof prisma.surveyResult>

describe('calculateUserScore', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockPillar.findMany.mockResolvedValue([] as any)
  })

  it('returns zero score, pillar defaults, and empty responses when no submissions exist', async () => {
    mockPillar.findMany.mockResolvedValue([] as any)
    mockResponse.findMany.mockResolvedValue([] as any)
    mockSurveyResult.upsert.mockResolvedValue({ id: 'r1', totalScore: 0 } as any)

    const result = await calculateUserScore('user-1')

    expect(mockSurveyResult.upsert).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      update: { totalScore: 0, breakdown: [] },
      create: { userId: 'user-1', totalScore: 0, breakdown: [] },
    })
    expect(result).toEqual({ totalScore: 0, breakdown: [], responses: [] })
  })

  it('aggregates responses by pillar, persists weighted score, and returns response metadata', async () => {
    mockPillar.findMany.mockResolvedValue([
      { id: 'p1', name: 'People', maxPoints: 10, weight: 0.4 },
      { id: 'p2', name: 'Planet', maxPoints: 5, weight: 0.6 },
    ] as any)

    mockResponse.findMany.mockResolvedValue([
      {
        score: 6,
        question: {
          id: 'q1',
          text: 'Question 1',
          pillar: {
            id: 'p1',
            name: 'People',
            maxPoints: 10,
            weight: 0.4,
          },
        },
        option: { id: 'o1', label: 'Option 1', points: 6 },
      },
      {
        score: 4,
        question: {
          id: 'q2',
          text: 'Question 2',
          pillar: {
            id: 'p2',
            name: 'Planet',
            maxPoints: 5,
            weight: 0.6,
          },
        },
        option: { id: 'o2', label: 'Option 2', points: 4 },
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
        weightedScore: 0.4 * (6 / 10),
      },
      {
        pillarId: 'p2',
        pillarName: 'Planet',
        obtained: 4,
        maxPoints: 5,
        weight: 0.6,
        weightedScore: 0.6 * (4 / 5),
      },
    ]

    const totalScore = expectedBreakdown.reduce((sum, item) => sum + item.weightedScore, 0)

    expect(mockSurveyResult.upsert).toHaveBeenCalledWith({
      where: { userId: 'user-2' },
      update: { totalScore, breakdown: expectedBreakdown },
      create: { userId: 'user-2', totalScore, breakdown: expectedBreakdown },
    })

    expect(result.totalScore).toBeCloseTo(totalScore)
    expect(result.breakdown).toEqual(expectedBreakdown)
    expect(result.responses).toEqual([
      {
        questionId: 'q1',
        questionText: 'Question 1',
        pillarId: 'p1',
        pillarName: 'People',
        optionId: 'o1',
        optionLabel: 'Option 1',
        points: 6,
      },
      {
        questionId: 'q2',
        questionText: 'Question 2',
        pillarId: 'p2',
        pillarName: 'Planet',
        optionId: 'o2',
        optionLabel: 'Option 2',
        points: 4,
      },
    ])
  })
})
