'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import type { QuestionResponse, PillarBreakdown } from '@/lib/scoring'
import { generateCertificate, copyResultsToClipboard, type CertificateData } from '@/lib/certificate'

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
  const { data: session } = useSession()
  const router = useRouter()
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

  const handleDownloadCertificate = () => {
    if (!data || !session?.user) return

    const certificateData: CertificateData = {
      userName: session.user.name || 'Usuario',
      userEmail: session.user.email || '',
      totalScore: data.summary.totalScore,
      completionDate: data.result ? new Date(data.result.createdAt).toLocaleDateString('es-ES') : new Date().toLocaleDateString('es-ES'),
      breakdown: data.summary.breakdown
    }

    generateCertificate(certificateData)
  }

  const handleCopyResults = () => {
    if (!data || !session?.user) return

    const certificateData: CertificateData = {
      userName: session.user.name || 'Usuario',
      userEmail: session.user.email || '',
      totalScore: data.summary.totalScore,
      completionDate: data.result ? new Date(data.result.createdAt).toLocaleDateString('es-ES') : new Date().toLocaleDateString('es-ES'),
      breakdown: data.summary.breakdown
    }

    copyResultsToClipboard(certificateData)
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const handleGoHome = () => {
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Your Dashboard</h2>
          <p className="text-gray-600">Preparing your sustainability certification results...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Algo salio mal</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <Link
            href="/survey"
            className="inline-flex items-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Ir a la Evaluacion</span>
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Page Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Mi Panel de Certificacion
              </h1>
              <p className="text-gray-600">Revisa los resultados e insights de tu evaluacion de sostenibilidad</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/survey"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Actualizar Evaluacion</span>
            </Link>
          </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {!hasResponses ? (
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">¿Listo para Certificarte?</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Completa la evaluacion integral de sostenibilidad para desbloquear tu panel de certificacion personalizado e insights detallados.
            </p>
              <Link
                href="/survey"
              className="inline-flex items-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl space-x-2"
              >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <span>Comenzar Evaluacion</span>
              </Link>
          </section>
        ) : (
          <>
            {/* Overall Score Card */}
            <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Green Fashion Score</h2>
                <p className="text-gray-600 mb-8">
                  Weighted total across all sustainability pillars
                </p>
                
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-gray-200"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - totalScore)}`}
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#14b8a6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        {formatPercentage(totalScore)}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">Puntuacion de Certificacion</div>
                    </div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500">
                  Evaluacion completada el {generatedAt}
                </div>
              </div>
            </section>

            {/* Pillar Breakdown */}
            <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Rendimiento por Pilares</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {breakdown.map((pillar) => {
                  const achievedRatio = pillar.maxPoints === 0 ? 0 : Math.min(1, pillar.obtained / pillar.maxPoints)
                  const weightedRatio = pillar.weight === 0 ? 0 : pillar.weightedScore / pillar.weight
                  const normalizedWeighted = Math.max(0, Math.min(1, weightedRatio))

                  return (
                    <div key={pillar.pillarId} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{pillar.pillarName}</h3>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-emerald-600">{formatPercentage(normalizedWeighted)}</div>
                          <div className="text-xs text-gray-500">Puntuacion Ponderada</div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Puntos Obtenidos</span>
                          <span className="font-medium">{pillar.obtained.toFixed(1)} / {pillar.maxPoints}</span>
                      </div>
                        
                      <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-1000 ease-out"
                          style={{ width: `${(achievedRatio * 100).toFixed(2)}%` }}
                        />
                      </div>
                        
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Peso del Pilar: {formatPercentage(pillar.weight)}</span>
                          <span>Impacto: {formatPercentage(normalizedWeighted)}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Detailed Responses */}
            <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Respuestas Detalladas</h2>
              <div className="space-y-4">
                {responses.map((response, index) => (
                  <div key={`${response.questionId}-${response.optionId ?? 'none'}`} className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 border border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                          <span className="text-emerald-600 font-semibold text-sm">{index + 1}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-emerald-600">{response.pillarName}</div>
                          <h3 className="text-lg font-semibold text-gray-900">{response.questionText}</h3>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-emerald-600">{response.points}</div>
                        <div className="text-xs text-gray-500">puntos</div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="text-sm text-gray-600 mb-1">Tu Respuesta:</div>
                      <div className="text-gray-900 font-medium">{response.optionLabel ?? 'No registrada'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Certification Badge */}
            <section className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-2xl p-8 text-white">
              <div className="text-center">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold mb-4">Certificacion de Sostenibilidad</h2>
                <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
                  ¡Felicidades! Has completado exitosamente la evaluacion Green Fashion Score. 
                  Tu certificacion demuestra tu compromiso con las practicas de moda sostenible.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button 
                    onClick={handleDownloadCertificate}
                    className="bg-white text-emerald-600 px-8 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Descargar Certificado</span>
                  </button>
                  <button 
                    onClick={handleCopyResults}
                    className="border border-white/50 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Copiar Resultados</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Navigation Options */}
            <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Opciones de Navegacion</h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button 
                    onClick={handleGoHome}
                    className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>Volver al Inicio</span>
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Cerrar Sesion</span>
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
