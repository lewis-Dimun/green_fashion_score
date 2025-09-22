import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function SurveyPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  if (session.user.role !== 'USER') {
    redirect('/unauthorized')
  }

  const pillars = await prisma.pillar.findMany({
    orderBy: { createdAt: 'asc' },
    include: {
      questions: {
        orderBy: { createdAt: 'asc' },
        include: {
          options: {
            orderBy: { points: 'desc' },
          },
        },
      },
    },
  })

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Sustainability survey</h1>
          <p className="text-gray-600 mt-2">
            Review each pillar and select the option that best describes your brand. Your progress will be saved once submission is implemented.
          </p>
        </header>

        <section className="space-y-6">
          {pillars.length === 0 && (
            <div className="rounded-md border border-dashed border-gray-300 bg-white p-6 text-center text-gray-600">
              No survey content available yet. Please contact an administrator.
            </div>
          )}

          {pillars.map((pillar) => (
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
                    Max points: {pillar.maxPoints} · Weight: {pillar.weight}
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

                    <ul className="space-y-2">
                      {question.options.map((option) => (
                        <li key={option.id} className="rounded-md border border-gray-200 px-4 py-3">
                          <div className="flex items-start justify-between gap-4">
                            <p className="text-sm text-gray-700">{option.label}</p>
                            <span className="text-sm font-semibold text-gray-900">{option.points} pts</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}
