const companies = [
  { 
    name: "TWOTHIRDS", 
    description: "Marca española de moda sostenible con enfoque en materiales orgánicos"
  },
  { 
    name: "Sepiia", 
    description: "Tecnología textil innovadora para prendas funcionales"
  },
  { 
    name: "Ekomodo", 
    description: "Moda circular con prendas diseñadas para durar"
  }
]

export default function PilotCompanies() {
  return (
    <section className="py-16 bg-white/50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Empresas Piloto
        </h2>
        <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
          Estas marcas ya han confiado en Green Fashion Score para evaluar su sostenibilidad y mejorar sus practicas.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 items-center justify-items-center max-w-4xl mx-auto">
          {companies.map((company) => (
            <div 
              key={company.name} 
              className="group flex flex-col items-center justify-center p-6 rounded-xl hover:bg-white/80 transition-all duration-300 cursor-pointer border border-gray-200 hover:border-emerald-300"
              title={company.description}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mb-3 group-hover:from-emerald-200 group-hover:to-teal-200 transition-all duration-300">
                <span className="text-emerald-700 font-bold text-lg group-hover:text-emerald-800 transition-colors duration-300">
                  {company.name.charAt(0)}
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-emerald-700 transition-colors duration-300 text-center">
                {company.name}
              </span>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-12">
          <p className="text-sm text-gray-500 mb-4">
            ¿Quieres que tu marca aparezca aqui?
          </p>
          <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Unete como empresa piloto
          </button>
        </div>
      </div>
    </section>
  )
}
