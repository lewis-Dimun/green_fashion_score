'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Session } from 'next-auth'

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
  const [activeTab, setActiveTab] = useState<'survey' | 'results'>('survey')

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
      await jsonRequest('/api/pillars', {
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
      await jsonRequest('/api/pillars', { method: 'DELETE' })
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
      await jsonRequest('/api/questions', {
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
      await jsonRequest('/api/questions', { method: 'DELETE' })
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
      await jsonRequest('/api/options', {
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
      await jsonRequest('/api/options', { method: 'DELETE' })
      setStatus('Option deleted.')
      await loadData()
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Failed to delete option')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-sm font-bold">ADMIN</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Panel de Administracion
                </h1>
                <p className="text-gray-600">Conectado como {user.email} - gestiona contenido de encuestas y revisa envios</p>
              </div>
            </div>
            {status && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-600">{status}</p>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
          <button
            onClick={() => setActiveTab('survey')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'survey'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Constructor de Encuesta
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'results'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Resultados de Encuesta
          </button>
        </div>

        {isLoading ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
            <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Cargando Panel</h2>
            <p className="text-gray-600">Preparando la interfaz de administracion...</p>
          </div>
        ) : (
          <>
            {activeTab === 'survey' && (
              <div className="space-y-8">
                {/* Create New Pillar */}
                <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Crear Nuevo Pilar</h2>
                  <p className="text-gray-600 mb-6">
                    Los pilares definen la estructura y ponderacion del cuestionario.
                  </p>
                  <form
                    className="grid grid-cols-1 gap-4 md:grid-cols-2"
                    onSubmit={(event) => {
                      event.preventDefault()
                      void handleCreatePillar(event.currentTarget)
                    }}
                  >
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                      <input
                        name="name"
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Peso (0 - 1)</label>
                      <input
                        name="weight"
                        type="number"
                        step="0.01"
                        min="0"
                        max="1"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Puntos Maximos</label>
                      <input
                        name="maxPoints"
                        type="number"
                        min="0"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Descripcion</label>
                      <textarea
                        name="description"
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                        placeholder="Explain what this dimension measures"
                      />
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        Add Pillar
                      </button>
                    </div>
                  </form>
                </section>

                {/* Existing Pillars */}
                <section className="space-y-6">
                  {pillars.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
                      <div className="w-24 h-24 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Aun no hay pilares</h2>
                      <p className="text-gray-600">Crea tu primer pilar arriba para comenzar con el constructor de encuestas.</p>
                    </div>
                  ) : (
                    pillars.map((pillar) => (
                      <article key={pillar.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                        <header className="bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-6 text-white">
                          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                              <h3 className="text-2xl font-bold">{pillar.name}</h3>
                              {pillar.description && (
                                <p className="text-emerald-100 mt-2">{pillar.description}</p>
                              )}
                              <p className="text-emerald-200 text-sm mt-2">
                                Peso: {pillar.weight} • Puntos Maximos: {pillar.maxPoints}
                              </p>
                            </div>
                            <div className="flex gap-3">
                              <button
                                onClick={() => void handleEditPillar(pillar)}
                                className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors duration-200"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => void handleDeletePillar(pillar.id)}
                                className="bg-red-500/20 text-white px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors duration-200"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        </header>

                        <div className="p-8 space-y-6">
                          {/* Add Question Form */}
                          <form
                            className="bg-gray-50 rounded-xl p-6"
                            onSubmit={(event) => {
                              event.preventDefault()
                              void handleCreateQuestion(event.currentTarget, pillar.id)
                            }}
                          >
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Agregar Pregunta</h4>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                              <input
                                name="text"
                                type="text"
                                placeholder="Question text"
                                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                                required
                              />
                              <input
                                name="maxPoints"
                                type="number"
                                min="0"
                                placeholder="Max points"
                                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                                required
                              />
                              <button
                                type="submit"
                                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200"
                              >
                                Agregar Pregunta
                              </button>
                            </div>
                          </form>

                          {/* Questions */}
                          {pillar.questions.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">Aun no hay preguntas.</p>
                          ) : (
                            pillar.questions.map((question) => (
                              <div key={question.id} className="bg-gray-50 rounded-xl p-6">
                                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                  <div className="flex-1">
                                    <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                                      {question.text}
                                      {question.isHidden && (
                                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                                          Oculta
                                        </span>
                                      )}
                                    </h4>
                                    <p className="text-gray-600 mt-1">Puntos Maximos: {question.maxPoints}</p>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => void handleEditQuestion(question)}
                                      className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-200 transition-colors duration-200"
                                    >
                                      Editar
                                    </button>
                                    <button
                                      onClick={() => void handleDeleteQuestion(question.id)}
                                      className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors duration-200"
                                    >
                                      Eliminar
                                    </button>
                                  </div>
                                </div>

                                {/* Add Option Form */}
                                <form
                                  className="mt-6 bg-white rounded-lg p-4"
                                  onSubmit={(event) => {
                                    event.preventDefault()
                                    void handleCreateOption(event.currentTarget, question.id)
                                  }}
                                >
                                  <h5 className="text-sm font-semibold text-gray-800 mb-3">Agregar Opcion</h5>
                                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                    <input
                                      name="label"
                                      type="text"
                                      placeholder="Etiqueta de opcion"
                                      className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                                      required
                                    />
                                    <input
                                      name="points"
                                      type="number"
                                      placeholder="Puntos"
                                      className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                                      required
                                    />
                                    <button
                                      type="submit"
                                      className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors duration-200"
                                    >
                                      Agregar Opcion
                                    </button>
                                  </div>
                                </form>

                                {/* Options */}
                                {question.options.length === 0 ? (
                                  <p className="text-gray-500 text-center py-4">Aun no hay opciones.</p>
                                ) : (
                                  <div className="mt-4 space-y-2">
                                    {question.options.map((option) => (
                                      <div
                                        key={option.id}
                                        className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200"
                                      >
                                        <div>
                                          <p className="font-medium text-gray-800">{option.label}</p>
                                          <p className="text-sm text-gray-500">Puntos: {option.points}</p>
                                        </div>
                                        <div className="flex gap-2">
                                          <button
                                            onClick={() => void handleEditOption(option)}
                                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm hover:bg-gray-200 transition-colors duration-200"
                                          >
                                            Editar
                                          </button>
                                          <button
                                            onClick={() => void handleDeleteOption(option.id)}
                                            className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm hover:bg-red-200 transition-colors duration-200"
                                          >
                                            Eliminar
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </article>
                    ))
                  )}
                </section>
              </div>
            )}

            {activeTab === 'results' && (
              <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Ultimos Envios de Usuarios</h2>
                <p className="text-gray-600 mb-6">
                  Resumen de encuestas completadas. Los totales reflejan puntajes ponderados en todos los pilares.
                </p>
                {results.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Aun no hay envios</h3>
                    <p className="text-gray-600">Los envios de encuestas apareceran aqui cuando los usuarios completen la evaluacion.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Puntuacion</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completado</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {results.map((result) => (
                          <tr key={result.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {result.user.name ?? 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {result.user.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                                {result.user.role.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-emerald-600">
                              {result.totalScore.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {new Date(result.createdAt).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}