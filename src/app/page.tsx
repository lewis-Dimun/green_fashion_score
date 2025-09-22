import Link from 'next/link'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Green Fashion Score
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Authentication</h2>
            <p className="text-gray-600 mb-4">
              NextAuth.js with email/password authentication and role-based access control
            </p>
            <div className="space-y-2">
              <Link 
                href="/auth/signin" 
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Sign In
              </Link>
              <br />
              <Link 
                href="/auth/signup" 
                className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Sign Up
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Database</h2>
            <p className="text-gray-600 mb-4">
              Prisma with PostgreSQL for data management
            </p>
            <Link 
              href="/dashboard" 
              className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Dashboard
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Charts</h2>
            <p className="text-gray-600 mb-4">
              Chart.js for data visualization
            </p>
            <Link 
              href="/charts" 
              className="inline-block bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            >
              View Charts
            </Link>
          </div>
        </div>

        <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Project Features</h2>
          <ul className="space-y-2 text-gray-600">
            <li>✅ Next.js 15 with TypeScript</li>
            <li>✅ TailwindCSS for styling</li>
            <li>✅ Prisma ORM with PostgreSQL</li>
            <li>✅ NextAuth.js email/password authentication</li>
            <li>✅ Role-based access control</li>
            <li>✅ Chart.js for data visualization</li>
            <li>✅ Modern UI/UX design</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
