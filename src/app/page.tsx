import Link from 'next/link'

const highlights = [
  {
    title: 'Certified-ready surveys',
    description: 'Guide fashion brands through ESG pillars with structured questions and scoring.',
  },
  {
    title: 'Admin intelligence',
    description: 'Curate content, monitor submissions, and uncover insights from a single workspace.',
  },
  {
    title: 'Data your stakeholders trust',
    description: 'Role-based access, auditable scoring logic, and export-ready results built on Prisma.',
  },
]

const valueProps = [
  {
    title: 'Guided onboarding',
    description: 'Adaptive survey flows, contextual help, and autosave keep brand teams engaged end to end.',
  },
  {
    title: 'Evidence-backed scoring',
    description: 'Blend qualitative inputs and weighted KPIs to calculate Green Fashion Scores in real time.',
  },
  {
    title: 'Actionable dashboards',
    description: 'Progress heatmaps, cohort comparison, and exportable summaries for internal reviews.',
  },
  {
    title: 'Secure by design',
    description: 'NextAuth credentials, granular roles, and Prisma migrations keep data consistent and safe.',
  },
]

const steps = [
  {
    label: 'Plan',
    text: 'Publish the pillars, questions, and scoring weights that reflect your certification standard.',
  },
  {
    label: 'Engage',
    text: 'Invite brands to complete surveys with rich guidance, tooltips, and structured evidence capture.',
  },
  {
    label: 'Validate',
    text: 'Review responses, surface anomalies, and approve entries before scores are finalised.',
  },
  {
    label: 'Report',
    text: 'Share dashboards, export summaries, and celebrate sustainability milestones with stakeholders.',
  },
]

export default function Home() {
  return (
    <main className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-sky-50">
      <div className="absolute inset-x-0 top-[-6rem] -z-10 overflow-hidden blur-3xl">
        <div className="mx-auto h-[25rem] w-[36rem] rounded-full bg-gradient-to-tr from-emerald-200 to-sky-200 opacity-40" />
      </div>

      <section className="mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col items-center justify-center gap-10 px-6 pb-24 pt-32 text-center">
        <span className="rounded-full border border-emerald-100 bg-white/70 px-4 py-1 text-sm font-semibold uppercase tracking-wider text-emerald-700 shadow-sm">
          Sustainability intelligence for fashion
        </span>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
          Elevate every certification journey with data-rich, human-friendly surveys.
        </h1>
        <p className="max-w-2xl text-lg text-gray-600">
          Green Fashion Score helps certification bodies, auditors, and brand teams collaborate on responsible sourcing goals, while keeping every metric transparent and audit-ready.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/survey"
            className="rounded-lg bg-emerald-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700"
          >
            Start the brand survey
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-emerald-200 bg-white/80 px-6 py-3 text-base font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-white"
          >
            Explore the admin workspace
          </Link>
          <Link
            href="/auth/signin"
            className="rounded-lg border border-transparent px-6 py-3 text-base font-semibold text-gray-600 transition hover:text-gray-800"
          >
            Sign in
          </Link>
        </div>

        <div className="grid w-full max-w-4xl gap-3 sm:grid-cols-3">
          {highlights.map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/60 bg-white/80 p-6 text-left shadow-sm shadow-emerald-100">
              <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-24">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-3xl font-semibold text-gray-900">Built for modern certification teams</h2>
            <p className="mt-4 text-base text-gray-600">
              Every screen is crafted to reduce friction for survey participants while giving administrators the clarity they need. Borrowing cues from market-leading sustainability frameworks, the experience keeps scores transparent, explainable, and export-ready.
            </p>
            <dl className="mt-10 space-y-6">
              <div className="rounded-xl border border-emerald-100 bg-white/90 p-5 shadow-sm">
                <dt className="text-sm font-medium uppercase tracking-wide text-emerald-600">Reliability</dt>
                <dd className="mt-2 text-lg text-gray-800">Prisma migrations, automated scoring tests, and secure authentication as the backbone of every audit.</dd>
              </div>
              <div className="rounded-xl border border-emerald-100 bg-white/90 p-5 shadow-sm">
                <dt className="text-sm font-medium uppercase tracking-wide text-emerald-600">Engagement</dt>
                <dd className="mt-2 text-lg text-gray-800">Responsive layouts, progressive surveys, and contextual guidance designed to keep brand teams progressing.</dd>
              </div>
              <div className="rounded-xl border border-emerald-100 bg-white/90 p-5 shadow-sm">
                <dt className="text-sm font-medium uppercase tracking-wide text-emerald-600">Insight</dt>
                <dd className="mt-2 text-lg text-gray-800">Dashboards with dynamic charts and role-based perspectives make it easy to spot trends, gaps, and quick wins.</dd>
              </div>
            </dl>
          </div>
          <div className="flex flex-col justify-center gap-6">
            {valueProps.map((prop) => (
              <div key={prop.title} className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-sm shadow-emerald-100">
                <h3 className="text-lg font-semibold text-gray-900">{prop.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{prop.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 className="text-center text-3xl font-semibold text-gray-900">From intake to impact in four clear stages</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-base text-gray-600">
            Map your certification lifecycle to a single digital home. Each stage reinforces accountability and provides clarity for teams inside and outside your organisation.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.label} className="flex h-full flex-col rounded-2xl border border-emerald-100 bg-emerald-50/40 p-6 text-left shadow-sm">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-lg font-semibold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">{step.label}</h3>
                <p className="mt-3 text-sm text-gray-600">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-24">
        <div className="rounded-3xl bg-emerald-600 px-8 py-12 text-white shadow-2xl shadow-emerald-200 sm:px-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl space-y-4">
              <h2 className="text-3xl font-semibold">Ready to modernise your certification workflow?</h2>
              <p className="text-emerald-50/90">
                Create an account, explore the admin toolkit, and invite your brand cohorts to start tracking sustainability progress in minutes.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/auth/signup"
                className="rounded-lg bg-white px-6 py-3 text-center text-base font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-50"
              >
                Create account
              </Link>
              <Link
                href="/auth/signin"
                className="rounded-lg border border-white/50 px-6 py-3 text-center text-base font-semibold text-white transition hover:bg-white/10"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
