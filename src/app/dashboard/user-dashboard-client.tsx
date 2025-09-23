'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { QuestionResponse, PillarBreakdown } from '@/lib/scoring'

type ApiResponse = {
  userId: string
  summary: {
    totalScore: number
    breakdown: PillarBreakdown[]
    responses: QuestionResponse[]
  }
  result: {
    id: string
    createdAt: string
  } | null
}

function formatPercentage(value: number) {
  const safe = Number.isFinite(value) ? Math.max(0, value) : 0
  return `${(safe * 100).toFixed(2)}%`
}

export default function UserDashboardClient() {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const response = await fetch('/api/results/me', { cache: 'no-store' })
        if (!response.ok) {
          const body = await response.json().catch(() => ({}))
          throw new Error(body?.error ?? 'Unable to load survey results')
        }
        const payload = (await response.json()) as ApiResponse
        if (mounted) {
          setData(payload)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Unable to load survey results')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    void load()
    return () => {
      mounted = false
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-4xl rounded-md border border-gray-200 bg-white p-6 text-center text-gray-600">
          Loading your dashboard...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-4xl space-y-4 rounded-md border border-red-200 bg-white p-6">
          <h1 className="text-xl font-semibold text-gray-900">Something went wrong</h1>
          <p className="text-sm text-red-600">{error}</p>
          <Link
            href="/survey"
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Go to survey
          </Link>
        </div>
      </div>
    )
  }

  const breakdown = data?.summary.breakdown ?? []
  const responses = data?.summary.responses ?? []
  const totalScore = data?.summary.totalScore ?? 0
  const hasResponses = responses.length > 0
  const generatedAt = data?.result ? new Date(data.result.createdAt).toLocaleString() : 'just now'

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My sustainability dashboard</h1>
            <p className="text-sm text-gray-600">Review the latest results from your survey submission.</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/survey"
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
            >
              Update responses
            </Link>
          </div>
        </header>

        {!hasResponses ? (
          <section className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center text-gray-600">
            <h2 className="text-lg font-semibold text-gray-900">No survey data yet</h2>
            <p className="mt-2 text-sm">
              Complete the sustainability survey to unlock your personalised analytics.
            </p>
            <div className="mt-4">
              <Link
                href="/survey"
                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Start survey
              </Link>
            </div>
          </section>
        ) : (
          <>
            <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900">Overall score</h2>
              <p className="mt-1 text-sm text-gray-600">
                Weighted total across all pillars. Scores are capped at each dimension's weight.
              </p>
              <div className="mt-6">
                <p className="text-4xl font-bold text-gray-900">{formatPercentage(totalScore)}</p>
                <p className="text-xs text-gray-500">Generated {generatedAt}</p>
              </div>
            </section>

            <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900">Pillar breakdown</h2>
              <div className="mt-4 space-y-4">
                {breakdown.map((pillar) => {
                  const achievedRatio = pillar.maxPoints === 0 ? 0 : Math.min(1, pillar.obtained / pillar.maxPoints)
                  const weightedRatio = pillar.weight === 0 ? 0 : pillar.weightedScore / pillar.weight
                  const normalizedWeighted = Math.max(0, Math.min(1, weightedRatio))

                  return (
                    <div key={pillar.pillarId} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">{pillar.pillarName}</h3>
                        <span className="text-xs text-gray-600">
                          {pillar.obtained.toFixed(2)} / {pillar.maxPoints} pts - {formatPercentage(normalizedWeighted)} weighted
                        </span>
                      </div>
                      <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${(achievedRatio * 100).toFixed(2)}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500">Pillar weight: {formatPercentage(pillar.weight)}</p>
                    </div>
                  )
                })}
              </div>
            </section>

            <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900">Question level responses</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Pillar</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Question</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Selected option</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {responses.map((response) => (
                      <tr key={`${response.questionId}-${response.optionId ?? 'none'}`}>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-600">{response.pillarName}</td>
                        <td className="px-4 py-2 text-gray-900">{response.questionText}</td>
                        <td className="px-4 py-2 text-gray-700">{response.optionLabel ?? 'Not recorded'}</td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-900">{response.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
