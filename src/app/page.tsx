import Link from 'next/link'
import PilotCompanies from '@/components/PilotCompanies'

const trustLogos = [
  { name: 'B Corp', logo: 'B' },
  { name: 'EcoVadis', logo: 'E' },
  { name: 'ISO 14001', logo: 'ISO' },
  { name: 'Fairtrade', logo: 'F' },
]

const steps = [
  {
    step: '1',
    title: 'Responde la encuesta online',
    description: '15–20 minutos de preguntas sobre tu cadena de valor',
    icon: '📝',
  },
  {
    step: '2',
    title: 'Obtén tu puntuacion y categoria',
    description: 'Recibe una calificacion de A–E basada en tu rendimiento',
    icon: '📊',
  },
  {
    step: '3',
    title: 'Descarga tu certificado y compartelo',
    description: 'Badge digital verificable para web y redes sociales',
    icon: '🏆',
  },
]

const benefits = [
  {
    title: 'Visibilidad',
    description: 'Badge verificable para web y RRSS',
    icon: '👁️',
  },
  {
    title: 'Transparencia',
    description: 'Metodologia clara y auditable',
    icon: '🔍',
  },
  {
    title: 'Benchmarking',
    description: 'Comparacion con empresas del sector',
    icon: '📈',
  },
  {
    title: 'Mejora Continua',
    description: 'Insights para avanzar hacia sostenibilidad real',
    icon: '🔄',
  },
]

const comparisonData = [
  {
    feature: 'Foco en moda',
    gfs: true,
    bcorp: false,
    ecovadis: false,
    iso: false,
  },
  {
    feature: 'Rapido (15–20 min)',
    gfs: true,
    bcorp: false,
    ecovadis: false,
    iso: false,
  },
  {
    feature: 'Badge digital',
    gfs: true,
    bcorp: true,
    ecovadis: true,
    iso: false,
  },
  {
    feature: 'Certificacion ESG',
    gfs: true,
    bcorp: true,
    ecovadis: true,
    iso: true,
  },
]

const testimonials = [
  {
    quote: 'Green Fashion Score nos ayudo a identificar areas clave de mejora en nuestra cadena de suministro de manera rapida y clara.',
    author: 'Maria Rodriguez',
    company: 'EcoModa Sostenible',
    role: 'Fundadora',
  },
  {
    quote: 'La certificacion nos dio la credibilidad que necesitabamos para acceder a nuevos mercados y clientes conscientes.',
    author: 'Carlos Mendez',
    company: 'Textiles Verdes',
    role: 'CEO',
  },
]

const pilotCompanies = [
  'EcoModa Sostenible',
  'Textiles Verdes',
  'Fashion Circular',
  'Moda Consciente',
]

export default function Home() {
  return (
    <main className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Hero Section */}
      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center justify-center gap-8 px-6 py-20 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/30 to-teal-100/30" />
        
        <div className="relative z-10 space-y-8">
          <h1 className="max-w-4xl text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Certifica la sostenibilidad de tu marca de moda con{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Green Fashion Score
            </span>
          </h1>
          
          <p className="mx-auto max-w-3xl text-xl text-gray-600 lg:text-2xl">
            La herramienta independiente que evalua tu impacto en personas, planeta, materiales y circularidad. 
            Transparente, comparable y facil de comunicar.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/signup"
              className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-4 text-lg font-semibold text-white shadow-2xl shadow-emerald-200 transition-all duration-200 hover:from-emerald-700 hover:to-teal-700 hover:shadow-3xl"
            >
              Empieza tu evaluacion
            </Link>
            <Link
              href="#metodologia"
              className="rounded-xl border-2 border-emerald-600 bg-white/80 px-8 py-4 text-lg font-semibold text-emerald-600 transition-all duration-200 hover:bg-emerald-50"
            >
              Descubre la metodologia
            </Link>
          </div>
        </div>
        
        {/* Certificate Mockup */}
        <div className="relative z-10 mt-12">
          <div className="h-96 w-full max-w-4xl rounded-2xl bg-white/90 backdrop-blur-sm border border-white/20 shadow-2xl flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">📜</div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">Categoria B</div>
              <div className="text-2xl text-gray-600 mb-4">68/100</div>
              <div className="flex justify-center space-x-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-emerald-600 font-bold">👥</span>
                  </div>
                  <div className="text-sm text-gray-600">Personas</div>
                  <div className="text-lg font-bold text-emerald-600">15%</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-emerald-600 font-bold">🌍</span>
                  </div>
                  <div className="text-sm text-gray-600">Planeta</div>
                  <div className="text-lg font-bold text-emerald-600">20%</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-emerald-600 font-bold">🧵</span>
                  </div>
                  <div className="text-sm text-gray-600">Materiales</div>
                  <div className="text-lg font-bold text-emerald-600">18%</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-emerald-600 font-bold">♻️</span>
                  </div>
                  <div className="text-sm text-gray-600">Circularidad</div>
                  <div className="text-lg font-bold text-emerald-600">15%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Logos */}
      <section className="bg-white/50 py-16">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="text-center mb-8">
            <p className="text-lg text-gray-600 mb-8">
              Inspirado en estandares internacionales, adaptado al sector moda.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {trustLogos.map((logo) => (
              <div key={logo.name} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-gray-600 font-bold text-lg">{logo.logo}</span>
                </div>
                <span className="text-sm text-gray-500">{logo.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="mx-auto w-full max-w-7xl px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Como funciona
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            Proceso simple y transparente en solo 3 pasos
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.step} className="relative">
              <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="text-5xl mb-4">{step.icon}</div>
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 transform -translate-y-1/2" />
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link
            href="/auth/signup"
            className="inline-flex items-center rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-4 text-lg font-semibold text-white shadow-2xl shadow-emerald-200 transition-all duration-200 hover:from-emerald-700 hover:to-teal-700"
          >
            Inicia ahora tu evaluacion
          </Link>
        </div>
      </section>

      {/* Beneficios para tu Marca */}
      <section className="bg-white/50 py-20">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Beneficios para tu Marca
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              Descubre como Green Fashion Score puede transformar tu negocio
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparacion con Otras Certificaciones */}
      <section className="mx-auto w-full max-w-7xl px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Comparacion con Otras Certificaciones
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            Green Fashion Score esta disenado especificamente para el sector moda
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <thead className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Caracteristica</th>
                <th className="px-6 py-4 text-center font-semibold">Green Fashion Score</th>
                <th className="px-6 py-4 text-center font-semibold">B Corp</th>
                <th className="px-6 py-4 text-center font-semibold">EcoVadis</th>
                <th className="px-6 py-4 text-center font-semibold">ISO 14001</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, index) => (
                <tr key={row.feature} className={index % 2 === 0 ? 'bg-white/50' : 'bg-white/80'}>
                  <td className="px-6 py-4 font-medium text-gray-900">{row.feature}</td>
                  <td className="px-6 py-4 text-center">
                    {row.gfs ? (
                      <span className="text-emerald-600 text-xl">✅</span>
                    ) : (
                      <span className="text-gray-400 text-xl">❌</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {row.bcorp ? (
                      <span className="text-emerald-600 text-xl">✅</span>
                    ) : (
                      <span className="text-gray-400 text-xl">❌</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {row.ecovadis ? (
                      <span className="text-emerald-600 text-xl">✅</span>
                    ) : (
                      <span className="text-gray-400 text-xl">❌</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {row.iso ? (
                      <span className="text-emerald-600 text-xl">✅</span>
                    ) : (
                      <span className="text-gray-400 text-xl">❌</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="text-center mt-12">
          <Link
            href="/auth/signup"
            className="inline-flex items-center rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-4 text-lg font-semibold text-white shadow-2xl shadow-emerald-200 transition-all duration-200 hover:from-emerald-700 hover:to-teal-700"
          >
            Empieza tu Green Fashion Score
          </Link>
        </div>
      </section>

      {/* Ejemplo de Resultado */}
      <section className="bg-gradient-to-br from-emerald-100/50 to-teal-100/50 py-20">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Ejemplo de Resultado
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Asi veras tu puntuacion final y tu posicion frente al sector.
              </p>
              
              {/* Dynamic Result Mockup */}
              <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 p-8 shadow-xl">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-emerald-600 mb-2">Categoria B</div>
                  <div className="text-2xl text-gray-600">68/100</div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Personas</span>
                    <span className="font-bold text-emerald-600">15%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Planeta</span>
                    <span className="font-bold text-emerald-600">20%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Materiales</span>
                    <span className="font-bold text-emerald-600">18%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '18%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Circularidad</span>
                    <span className="font-bold text-emerald-600">15%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center lg:text-left">
              <div className="text-6xl mb-6">📊</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Resultados Claros y Accionables
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Cada puntuacion viene acompanada de un desglose detallado que te permite entender 
                exactamente donde estas y que areas necesitan atencion para mejorar tu sostenibilidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Empresas Piloto */}
      <PilotCompanies />

      {/* Testimonios */}
      <section className="mx-auto w-full max-w-7xl px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Testimonios
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            Marcas que ya se han certificado con Green Fashion Score
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 p-8 shadow-xl">
              <div className="text-4xl text-emerald-600 mb-4">"</div>
              <p className="text-lg text-gray-700 mb-6 italic">
                {testimonial.quote}
              </p>
              <div className="border-t border-gray-200 pt-4">
                <div className="font-semibold text-gray-900">{testimonial.author}</div>
                <div className="text-emerald-600">{testimonial.role}, {testimonial.company}</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pilot Companies */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Empresas Piloto
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {pilotCompanies.map((company) => (
              <div key={company} className="text-lg font-semibold text-gray-400">
                {company}
              </div>
            ))}
          </div>
          <p className="mt-8 text-gray-600">
            Metodologia desarrollada por <span className="font-semibold text-emerald-600">ECODICTA</span>.
          </p>
        </div>
      </section>

      {/* Call to Action Final */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 py-20">
        <div className="mx-auto w-full max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Descubre que letra obtiene tu marca
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Unete a las marcas que ya estan transformando la industria de la moda
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/signup"
              className="rounded-xl bg-white px-8 py-4 text-lg font-semibold text-emerald-600 shadow-2xl transition-all duration-200 hover:bg-emerald-50"
            >
              Haz la encuesta ahora
            </Link>
            <Link
              href="#contacto"
              className="rounded-xl border-2 border-white/50 bg-transparent px-8 py-4 text-lg font-semibold text-white transition-all duration-200 hover:bg-white/10"
            >
              Habla con un asesor
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-16">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-sm font-bold">GFS</span>
                </div>
                <span className="text-2xl font-bold text-white">Green Fashion Score</span>
              </div>
              <p className="text-gray-400 mb-4">
                Green Fashion Score es una herramienta independiente para el sector moda.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Navegacion</h3>
              <ul className="space-y-2">
                <li><Link href="#metodologia" className="text-gray-400 hover:text-white transition-colors">Metodologia</Link></li>
                <li><Link href="#faqs" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="#contacto" className="text-gray-400 hover:text-white transition-colors">Contacto</Link></li>
                <li><Link href="#legal" className="text-gray-400 hover:text-white transition-colors">Legal</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Redes Sociales</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">LinkedIn</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Instagram</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Green Fashion Score. Una herramienta desarrollada por ECODICTA.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
