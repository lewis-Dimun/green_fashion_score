import Link from 'next/link'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Green Fashion Score
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Authentication</h2>
            <p className="text-gray-600 mb-4">
              Email/password sign in powered by NextAuth.js and Prisma.
            </p>
            <div className="space-y-2">
              <Link
                href="/auth/signin"
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Sign in
              </Link>
              <br />
              <Link
                href="/auth/signup"
                className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Sign up
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Admin panel</h2>
            <p className="text-gray-600 mb-4">
              Administrators can manage the survey and review submissions.
            </p>
            <Link
              href="/dashboard"
              className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Go to dashboard
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Survey</h2>
            <p className="text-gray-600 mb-4">
              Respond to the sustainability questionnaire pillar by pillar.
            </p>
            <Link
              href="/survey"
              className="inline-block bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600"
            >
              Start survey
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Charts</h2>
            <p className="text-gray-600 mb-4">
              Explore data visualisations built with Chart.js.
            </p>
            <Link
              href="/charts"
              className="inline-block bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            >
              View charts
            </Link>
          </div>
        </div>

        <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Project features</h2>
          <ul className="space-y-2 text-gray-600 list-disc list-inside">
            <li>Next.js 15 with TypeScript</li>
            <li>Tailwind CSS for styling</li>
            <li>Prisma ORM with PostgreSQL</li>
            <li>NextAuth.js credentials provider with role-based sessions</li>
            <li>Admin-only management dashboard</li>
            <li>User-focused sustainability survey powered by Prisma data</li>
            <li>Chart.js for data visualization</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
