'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
} from 'chart.js'
import { Radar, Bar, Pie, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
)

type OptionDto = {
  id: string
  label: string
  points: number
}

type QuestionDto = {
  id: string
  text: string
  maxPoints: number
  options: OptionDto[]
}

type PillarDto = {
  id: string
  name: string
  description: string | null
  maxPoints: number
  weight: number
  questions: QuestionDto[]
}

type SurveyFetchResponse = {
  pillars: PillarDto[]
  userId?: string
}

type ScoringBreakdown = {
  pillarId: string
  pillarName: string
  obtained: number
  maxPoints: number
  weight: number
  weightedScore: number
}

type QuestionResponse = {
  questionId: string
  questionText: string
  pillarId: string
  pillarName: string
  optionId: string | null
  optionLabel: string | null
  points: number
}

type ScoringResponse = {
  totalScore: number
  breakdown: ScoringBreakdown[]
  responses?: QuestionResponse[]
}

export default function SurveyClient() {
  const router = useRouter()
  const [data, setData] = useState<PillarDto[] | null>(null)
  const [selected, setSelected] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ScoringResponse | null>(null)

  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      try {
        const res = await fetch('/api/survey', { cache: 'no-store' })
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.error ?? 'Failed to load survey')
        }
        const json = (await res.json()) as SurveyFetchResponse
        if (!cancelled) {
          setData(json.pillars)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load survey')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchData()
    return () => {
      cancelled = true
    }
  }, [])

  const totalQuestions = useMemo(() => (
    data?.reduce((count, pillar) => count + pillar.questions.length, 0) ?? 0
  ), [data])

  const unansweredCount = useMemo(() => {
    if (!data) return totalQuestions
    let count = 0
    for (const pillar of data) {
      for (const question of pillar.questions) {
        if (!selected[question.id]) {
          count++
        }
      }
    }
    return count
  }, [data, selected, totalQuestions])

  const handleSelection = (questionId: string, optionId: string) => {
    setSelected((prev) => ({ ...prev, [questionId]: optionId }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!data) return

    if (unansweredCount > 0) {
      setError('Please answer every question before submitting.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const responses = Object.entries(selected).map(([questionId, optionId]) => ({
        questionId,
        optionId,
      }))

      const res = await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'Failed to submit survey')
      }

      const scoring = (await res.json()) as ScoringResponse
      setResult(scoring)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit survey')
    } finally {
      setSubmitting(false)
    }
  }

  const totalScorePercent = useMemo(() => {
    if (!result) return 0
    return Math.max(0, Math.min(100, Number((result.totalScore * 100).toFixed(2))))
  }, [result])

  const radarData = useMemo(() => {
    if (!result) return null
    const labels = result.breakdown.map((b) => b.pillarName)
    return {
      labels,
      datasets: [
        {
          label: 'Obtained',
          data: result.breakdown.map((b) => b.obtained),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        },
        {
          label: 'Max points',
          data: result.breakdown.map((b) => b.maxPoints),
          backgroundColor: 'rgba(54, 162, 235, 0.1)',
          borderColor: 'rgba(54, 162, 235, 0.6)',
          pointBackgroundColor: 'rgba(54, 162, 235, 0.6)',
        },
      ],
    }
  }, [result])

  const barData = useMemo(() => {
    if (!result) return null
    const labels = result.breakdown.map((b) => b.pillarName)
    return {
      labels,
      datasets: [
        {
          label: 'Obtained',
          data: result.breakdown.map((b) => b.obtained),
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
        },
        {
          label: 'Max points',
          data: result.breakdown.map((b) => b.maxPoints),
          backgroundColor: 'rgba(148, 163, 184, 0.8)',
        },
      ],
    }
  }, [result])

  const pieData = useMemo(() => {
    if (!result) return null
    const labels = result.breakdown.map((b) => b.pillarName)
    const weights = result.breakdown.map((b) => b.weight)
    return {
      labels,
      datasets: [
        {
          data: weights,
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(234, 179, 8, 0.8)',
            'rgba(99, 102, 241, 0.8)',
            'rgba(248, 113, 113, 0.8)',
          ],
        },
      ],
    }
  }, [result])

  const gaugeData = useMemo(() => {
    if (!result) return null
    return {
      labels: ['Score', 'Remaining'],
      datasets: [
        {
          data: [totalScorePercent, 100 - totalScorePercent],
          backgroundColor: ['rgba(79, 70, 229, 0.85)', 'rgba(226, 232, 240, 0.8)'],
          borderWidth: 0,
          circumference: 180,
          rotation: -90,
        },
      ],
    }
  }, [result, totalScorePercent])

  const gaugeOptions = useMemo(() => ({
    responsive: true,
    cutout: '70%',
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  }), [])

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading survey...</p>
      </main>
    )
  }

  if (error && !data) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Unable to load survey</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </main>
    )
  }

  if (result) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <header className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Survey results</h1>
            <p className="text-gray-600 mt-2">
              Total score: <span className="font-semibold">{totalScorePercent.toFixed(2)}%</span>
            </p>
          </header>

          <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance by pillar</h2>
              {radarData && (
                <Radar
                  data={radarData}
                  options={{
                    responsive: true,
                    plugins: { legend: { position: 'top' as const } },
                  }}
                />
              )}
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Points earned vs maximum</h2>
              {barData && (
                <Bar
                  data={barData}
                  options={{
                    responsive: true,
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              )}
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Pillar weight distribution</h2>
              {pieData && (
                <Pie
                  data={pieData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: 'bottom' as const },
                    },
                  }}
                />
              )}
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm flex flex-col items-center justify-center">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Overall score</h2>
              <div className="w-48 h-24">
                {gaugeData && <Doughnut data={gaugeData} options={gaugeOptions} />}
              </div>
              <p className="mt-4 text-sm text-gray-600">{totalScorePercent.toFixed(2)}% out of 100%</p>
            </div>
          </section>

          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={() => router.replace('/dashboard')}
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Go to dashboard
            </button>
            <button
              type="button"
              onClick={() => {
                setResult(null)
                setSelected({})
              }}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
            >
              Retake survey
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Sustainability survey</h1>
          <p className="text-gray-600 mt-2">
            Review each pillar and select the option that best describes your brand. Answers are required for every question.
          </p>
          {unansweredCount > 0 && (
            <p className="mt-3 text-sm text-orange-600">
              {unansweredCount} question{unansweredCount === 1 ? '' : 's'} remaining.
            </p>
          )}
          {error && (
            <p className="mt-3 text-sm text-red-600">{error}</p>
          )}
        </header>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {data?.length === 0 && (
            <div className="rounded-md border border-dashed border-gray-300 bg-white p-6 text-center text-gray-600">
              No survey content available yet. Please contact an administrator.
            </div>
          )}

          {data?.map((pillar) => (
            <article key={pillar.id} className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <header className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{pillar.name}</h2>
                    {pillar.description && (
                      <p className="text-sm text-gray-600 mt-1">{pillar.description}</p>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    Max points: {pillar.maxPoints} - Weight: {pillar.weight}
                  </div>
                </div>
              </header>

              <div className="divide-y divide-gray-200">
                {pillar.questions.map((question) => (
                  <div key={question.id} className="px-6 py-4 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-lg font-medium text-gray-900">{question.text}</h3>
                      <span className="text-sm text-gray-500">Max points: {question.maxPoints}</span>
                    </div>

                    <fieldset className="space-y-2">
                      {question.options.map((option) => (
                        <label key={option.id} className="flex w-full items-start gap-3 rounded-md border border-gray-200 px-4 py-3 hover:border-indigo-400">
                          <input
                            type="radio"
                            name={question.id}
                            value={option.id}
                            checked={selected[question.id] === option.id}
                            onChange={() => handleSelection(question.id, option.id)}
                            className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                            required
                          />
                          <span className="flex flex-col">
                            <span className="text-sm text-gray-800">{option.label}</span>
                            <span className="text-xs text-gray-500">{option.points} pts</span>
                          </span>
                        </label>
                      ))}
                    </fieldset>
                  </div>
                ))}
              </div>
            </article>
          ))}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || unansweredCount > 0}
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
            >
              {submitting ? 'Submitting...' : 'Submit survey'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

