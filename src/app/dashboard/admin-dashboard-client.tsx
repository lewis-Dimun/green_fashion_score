'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Session } from 'next-auth'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type OptionDto = {
  id: string
  label: string
  points: number
}

type QuestionDto = {
  id: string
  text: string
  maxPoints: number
  isHidden: boolean
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

type SurveyResultDto = {
  id: string
  totalScore: number
  breakdown: unknown
  createdAt: string
  user: {
    id: string
    email: string
    name: string | null
    role: string
  }
}

type AdminDashboardClientProps = {
  user: Session['user']
}

async function jsonRequest<T>(input: RequestInfo | URL, init?: RequestInit) {
  const response = await fetch(input, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    const message = typeof errorBody?.error === 'string' ? errorBody.error : response.statusText
    throw new Error(message)
  }

  return (await response.json()) as T
}

export default function AdminDashboardClient({ user }: AdminDashboardClientProps) {
  const [pillars, setPillars] = useState<PillarDto[]>([])
  const [results, setResults] = useState<SurveyResultDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const [pillarsResponse, resultsResponse] = await Promise.all([
        jsonRequest<PillarDto[]>('/api/pillars'),
        jsonRequest<SurveyResultDto[]>('/api/results'),
      ])
      setPillars(pillarsResponse)
      setResults(resultsResponse)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const handleCreatePillar = async (form: HTMLFormElement) => {
    const formData = new FormData(form)
    const payload = {
      name: String(formData.get('name') || '').trim(),
      description: String(formData.get('description') || '').trim() || null,
      maxPoints: Number(formData.get('maxPoints') || 0),
      weight: Number(formData.get('weight') || 0),
    }

    if (!payload.name || Number.isNaN(payload.maxPoints) || Number.isNaN(payload.weight)) {
      setStatus('Provide valid name, max points, and weight for the pillar.')
      return
    }

    try {
      await jsonRequest('/api/pillars', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      setStatus('Pillar created successfully.')
      form.reset()
      await loadData()
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Failed to create pillar')
    }
  }

  const handleEditPillar = async (pillar: PillarDto) => {
    const name = window.prompt('Pillar name', pillar.name)?.trim()
    if (!name) return
    const weightInput = window.prompt('Weight (0 - 1)', pillar.weight.toString())
    const maxPointsInput = window.prompt('Max points', pillar.maxPoints.toString())
    const description = window.prompt('Description', pillar.description ?? '') ?? ''

    const weight = Number(weightInput)
    const maxPoints = Number(maxPointsInput)
    if (Number.isNaN(weight) || Number.isNaN(maxPoints)) {
      setStatus('Weight and max points must be valid numbers.')
      return
    }

    try {
      await jsonRequest(/api/pillars/, {
        method: 'PUT',
        body: JSON.stringify({ name, description: description.trim() || null, weight, maxPoints }),
      })
      setStatus('Pillar updated successfully.')
      await loadData()
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Failed to update pillar')
    }
  }

  const handleDeletePillar = async (pillarId: string) => {
    const confirmed = window.confirm('Delete pillar and all nested questions/options?')
    if (!confirmed) return

    try {
      await jsonRequest(/api/pillars/, { method: 'DELETE' })
      setStatus('Pillar deleted.')
      await loadData()
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Failed to delete pillar')
    }
  }

  const handleCreateQuestion = async (form: HTMLFormElement, pillarId: string) => {
    const formData = new FormData(form)
    const payload = {
      text: String(formData.get('text') || '').trim(),
      maxPoints: Number(formData.get('maxPoints') || 0),
      pillarId,
    }

    if (!payload.text || Number.isNaN(payload.maxPoints)) {
      setStatus('Provide valid question text and max points.')
      return
    }

    try {
      await jsonRequest('/api/questions', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      setStatus('Question created successfully.')
      form.reset()
      await loadData()
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Failed to create question')
    }
  }

  const handleEditQuestion = async (question: QuestionDto) => {
    const text = window.prompt('Question text', question.text)?.trim()
    if (!text) return
    const maxPointsInput = window.prompt('Max points', question.maxPoints.toString())
    const maxPoints = Number(maxPointsInput)
    if (Number.isNaN(maxPoints)) {
      setStatus('Max points must be a number.')
      return
    }

    const isHidden = window.confirm('Hide this question from the survey? Select OK to hide, Cancel to show.')

    try {
      await jsonRequest(/api/questions/, {
        method: 'PUT',
        body: JSON.stringify({ text, maxPoints, isHidden }),
      })
      setStatus('Question updated successfully.')
      await loadData()
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Failed to update question')
    }
  }

  const handleDeleteQuestion = async (questionId: string) => {
    if (!window.confirm('Delete this question and its options?')) return
    try {
      await jsonRequest(/api/questions/, { method: 'DELETE' })
      setStatus('Question deleted.')
      await loadData()
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Failed to delete question')
    }
  }

  const handleCreateOption = async (form: HTMLFormElement, questionId: string) => {
    const formData = new FormData(form)
    const payload = {
      label: String(formData.get('label') || '').trim(),
      points: Number(formData.get('points') || 0),
      questionId,
    }

    if (!payload.label || Number.isNaN(payload.points)) {
      setStatus('Provide option label and numeric points.')
      return
    }

    try {
      await jsonRequest('/api/options', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      setStatus('Option created successfully.')
      form.reset()
      await loadData()
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Failed to create option')
    }
  }

  const handleEditOption = async (option: OptionDto) => {
    const label = window.prompt('Option label', option.label)?.trim()
    if (!label) return
    const pointsInput = window.prompt('Points', option.points.toString())
    const points = Number(pointsInput)
    if (Number.isNaN(points)) {
      setStatus('Points must be numeric.')
      return
    }

    try {
      await jsonRequest(/api/options/, {
        method: 'PUT',
        body: JSON.stringify({ label, points }),
      })
      setStatus('Option updated successfully.')
      await loadData()
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Failed to update option')
    }
  }

  const handleDeleteOption = async (optionId: string) => {
    if (!window.confirm('Delete this option?')) return
    try {
      await jsonRequest(/api/options/, { method: 'DELETE' })
      setStatus('Option deleted.')
      await loadData()
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Failed to delete option')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900">Admin dashboard</h1>
          <p className="text-sm text-gray-600">
            Signed in as {user.email} · manage survey content, review submissions, and monitor scoring.
          </p>
          {status && <p className="text-sm text-indigo-600">{status}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </header>

        {isLoading ? (
          <div className="rounded-md border border-gray-200 bg-white p-6 text-center text-gray-600">
            Loading dashboard data...
          </div>
        ) : (
          <Tabs defaultValue="survey" className="space-y-6">
            <TabsList>
              <TabsTrigger value="survey">Survey builder</TabsTrigger>
              <TabsTrigger value="results">Survey results</TabsTrigger>
            </TabsList>

            <TabsContent value="survey" className="space-y-8">
              <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900">Create new pillar</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Dimensions define the questionnaire structure and weighting.
                </p>
                <form
                  className="grid grid-cols-1 gap-4 md:grid-cols-2"
                  onSubmit={(event) => {
                    event.preventDefault()
                    void handleCreatePillar(event.currentTarget)
                  }}
                >
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      name="name"
                      type="text"
                      required
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Weight (0 - 1)</label>
                    <input
                      name="weight"
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      required
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Max points</label>
                    <input
                      name="maxPoints"
                      type="number"
                      min="0"
                      required
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      name="description"
                      rows={2}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="Explain what this dimension measures"
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                      Add pillar
                    </button>
                  </div>
                </form>
              </section>

              <section className="space-y-6">
                {pillars.length === 0 ? (
                  <div className="rounded-md border border-dashed border-gray-300 bg-white p-6 text-center text-gray-600">
                    No pillars defined yet. Create one above to get started.
                  </div>
                ) : (
                  pillars.map((pillar) => (
                    <article key={pillar.id} className="rounded-lg border border-gray-200 bg-white shadow-sm">
                      <header className="flex flex-col gap-2 border-b border-gray-200 px-6 py-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{pillar.name}</h3>
                          {pillar.description && (
                            <p className="text-sm text-gray-600">{pillar.description}</p>
                          )}
                          <p className="mt-1 text-xs text-gray-500">
                            Weight: {pillar.weight} · Max points: {pillar.maxPoints}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => void handleEditPillar(pillar)}
                            className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => void handleDeletePillar(pillar.id)}
                            className="rounded-md border border-red-200 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </header>

                      <div className="space-y-4 px-6 py-4">
                        <form
                          className="rounded-md border border-gray-200 p-4"
                          onSubmit={(event) => {
                            event.preventDefault()
                            void handleCreateQuestion(event.currentTarget, pillar.id)
                          }}
                        >
                          <h4 className="text-sm font-semibold text-gray-800">Add question</h4>
                          <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-3">
                            <input
                              name="text"
                              type="text"
                              placeholder="Question text"
                              className="rounded-md border border-gray-300 px-3 py-2"
                              required
                            />
                            <input
                              name="maxPoints"
                              type="number"
                              min="0"
                              placeholder="Max points"
                              className="rounded-md border border-gray-300 px-3 py-2"
                              required
                            />
                            <button
                              type="submit"
                              className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                            >
                              Add question
                            </button>
                          </div>
                        </form>

                        {pillar.questions.length === 0 ? (
                          <p className="text-sm text-gray-500">No questions yet.</p>
                        ) : (
                          pillar.questions.map((question) => (
                            <div key={question.id} className="rounded-md border border-gray-200 p-4">
                              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                                <div>
                                  <h4 className="text-base font-medium text-gray-900">
                                    {question.text}
                                    {question.isHidden && (
                                      <span className="ml-2 rounded bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800">
                                        Hidden
                                      </span>
                                    )}
                                  </h4>
                                  <p className="text-xs text-gray-500">Max points: {question.maxPoints}</p>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => void handleEditQuestion(question)}
                                    className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => void handleDeleteQuestion(question.id)}
                                    className="rounded-md border border-red-200 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>

                              <div className="mt-4 space-y-3">
                                <form
                                  className="rounded-md border border-gray-200 p-3"
                                  onSubmit={(event) => {
                                    event.preventDefault()
                                    void handleCreateOption(event.currentTarget, question.id)
                                  }}
                                >
                                  <h5 className="text-sm font-semibold text-gray-800">Add option</h5>
                                  <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-3">
                                    <input
                                      name="label"
                                      type="text"
                                      placeholder="Option label"
                                      className="rounded-md border border-gray-300 px-3 py-2"
                                      required
                                    />
                                    <input
                                      name="points"
                                      type="number"
                                      placeholder="Points"
                                      className="rounded-md border border-gray-300 px-3 py-2"
                                      required
                                    />
                                    <button
                                      type="submit"
                                      className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                                    >
                                      Add option
                                    </button>
                                  </div>
                                </form>

                                {question.options.length === 0 ? (
                                  <p className="text-sm text-gray-500">No options defined.</p>
                                ) : (
                                  <ul className="space-y-2">
                                    {question.options.map((option) => (
                                      <li
                                        key={option.id}
                                        className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2"
                                      >
                                        <div>
                                          <p className="text-sm font-medium text-gray-800">{option.label}</p>
                                          <p className="text-xs text-gray-500">Points: {option.points}</p>
                                        </div>
                                        <div className="flex gap-2">
                                          <button
                                            onClick={() => void handleEditOption(option)}
                                            className="rounded-md border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:bg-gray-100"
                                          >
                                            Edit
                                          </button>
                                          <button
                                            onClick={() => void handleDeleteOption(option.id)}
                                            className="rounded-md border border-red-200 px-3 py-1 text-xs text-red-600 hover:bg-red-50"
                                          >
                                            Delete
                                          </button>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </article>
                  ))
                )}
              </section>
            </TabsContent>

            <TabsContent value="results">
              <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900">Latest user submissions</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Overview of completed surveys. Totals reflect weighted scores across all pillars.
                </p>
                {results.length === 0 ? (
                  <p className="text-sm text-gray-500">No survey submissions recorded yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left font-semibold text-gray-700">User</th>
                          <th className="px-4 py-2 text-left font-semibold text-gray-700">Email</th>
                          <th className="px-4 py-2 text-left font-semibold text-gray-700">Role</th>
                          <th className="px-4 py-2 text-left font-semibold text-gray-700">Score</th>
                          <th className="px-4 py-2 text-left font-semibold text-gray-700">Completed</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {results.map((result) => (
                          <tr key={result.id}>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-900">{result.user.name ?? 'n/a'}</td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-600">{result.user.email}</td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-600 uppercase">{result.user.role}</td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-900">{result.totalScore.toFixed(2)}</td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-600">
                              {new Date(result.createdAt).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
