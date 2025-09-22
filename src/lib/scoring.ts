import { prisma } from '@/lib/prisma'

export type PillarBreakdown = {
  pillarId: string
  pillarName: string
  obtained: number
  maxPoints: number
  weight: number
  weightedScore: number
}

export type ScoringResult = {
  totalScore: number
  breakdown: PillarBreakdown[]
}

export async function calculateUserScore(userId: string): Promise<ScoringResult> {
  const responses = await prisma.response.findMany({
    where: { userId },
    include: {
      question: {
        include: {
          pillar: true,
        },
      },
    },
  })

  const pillarMap = new Map<string, {
    pillarId: string
    pillarName: string
    maxPoints: number
    weight: number
    obtained: number
  }>()

  for (const response of responses) {
    const question = response.question
    const pillar = question?.pillar
    if (!pillar) continue

    const entry = pillarMap.get(pillar.id) ?? {
      pillarId: pillar.id,
      pillarName: pillar.name,
      maxPoints: pillar.maxPoints,
      weight: pillar.weight,
      obtained: 0,
    }

    entry.obtained += response.score ?? 0
    pillarMap.set(pillar.id, entry)
  }

  const breakdown: PillarBreakdown[] = [...pillarMap.values()].map((entry) => {
    const capped = Math.min(entry.obtained, entry.maxPoints)
    const weightedScore = capped >= entry.maxPoints
      ? entry.weight
      : entry.maxPoints === 0
        ? 0
        : (entry.weight / entry.maxPoints) * capped

    return {
      pillarId: entry.pillarId,
      pillarName: entry.pillarName,
      obtained: entry.obtained,
      maxPoints: entry.maxPoints,
      weight: entry.weight,
      weightedScore,
    }
  })

  const totalScore = breakdown.reduce((sum, item) => sum + item.weightedScore, 0)

  await prisma.surveyResult.create({
    data: {
      userId,
      totalScore,
      breakdown,
    },
  })

  return { totalScore, breakdown }
}
