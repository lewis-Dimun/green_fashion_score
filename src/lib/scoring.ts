import { prisma } from '@/lib/prisma'

export type PillarBreakdown = {
  pillarId: string
  pillarName: string
  obtained: number
  maxPoints: number
  weight: number
  weightedScore: number
}

export type QuestionResponse = {
  questionId: string
  questionText: string
  pillarId: string
  pillarName: string
  optionId: string | null
  optionLabel: string | null
  points: number
}

export type ScoringResult = {
  totalScore: number
  breakdown: PillarBreakdown[]
  responses: QuestionResponse[]
}

function safeDivide(numerator: number, denominator: number) {
  if (denominator === 0) return 0
  return numerator / denominator
}

export async function calculateUserScore(userId: string): Promise<ScoringResult> {
  const pillars = await prisma.pillar.findMany({
    select: {
      id: true,
      name: true,
      maxPoints: true,
      weight: true,
    },
    orderBy: { createdAt: 'asc' },
  })

  const responses = await prisma.response.findMany({
    where: { userId },
    include: {
      question: {
        include: {
          pillar: true,
        },
      },
      option: {
        select: {
          id: true,
          label: true,
          points: true,
        },
      },
    },
  })

  const pillarMap = new Map(
    pillars.map((pillar) => [
      pillar.id,
      {
        pillarId: pillar.id,
        pillarName: pillar.name,
        maxPoints: pillar.maxPoints,
        weight: pillar.weight,
        obtained: 0,
      },
    ]),
  )

  const responseSummaries: QuestionResponse[] = []

  for (const response of responses) {
    const question = response.question
    const pillar = question?.pillar
    if (!pillar) continue

    const entry = pillarMap.get(pillar.id)
    if (!entry) {
      pillarMap.set(pillar.id, {
        pillarId: pillar.id,
        pillarName: pillar.name,
        maxPoints: pillar.maxPoints,
        weight: pillar.weight,
        obtained: response.score ?? 0,
      })
    } else {
      entry.obtained += response.score ?? 0
    }

    responseSummaries.push({
      questionId: question.id,
      questionText: question.text,
      pillarId: pillar.id,
      pillarName: pillar.name,
      optionId: response.option?.id ?? null,
      optionLabel: response.option?.label ?? null,
      points: response.option?.points ?? Number(response.score ?? 0),
    })
  }

  const breakdown: PillarBreakdown[] = Array.from(pillarMap.values()).map((entry) => {
    const capped = Math.min(entry.obtained, entry.maxPoints)
    const weightedScore =
      capped >= entry.maxPoints
        ? entry.weight
        : entry.maxPoints === 0
          ? 0
          : entry.weight * safeDivide(capped, entry.maxPoints)

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

  await prisma.surveyResult.upsert({
    where: { userId },
    update: { totalScore, breakdown },
    create: {
      userId,
      totalScore,
      breakdown,
    },
  })

  return { totalScore, breakdown, responses: responseSummaries }
}
