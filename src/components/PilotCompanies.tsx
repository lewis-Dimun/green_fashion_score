import Image from "next/image"

const companies = [
  { 
    name: "TWOTHIRDS", 
    logo: "/logos/twothirds.svg",
    description: "Marca española de moda sostenible con enfoque en materiales orgánicos"
  },
  { 
    name: "Organic Cotton Colours", 
    logo: "/logos/organiccotton.svg",
    description: "Especialistas en algodón orgánico con colores naturales"
  },
  { 
    name: "Sepiia", 
    logo: "/logos/sepiia.svg",
    description: "Tecnología textil innovadora para prendas funcionales"
  },
  { 
    name: "Lefrik", 
    logo: "/logos/lefrik.svg",
    description: "Bolsos y accesorios sostenibles hechos de materiales reciclados"
  },
  { 
    name: "Ekomodo", 
    logo: "/logos/ekomodo.svg",
    description: "Moda circular con prendas diseñadas para durar"
  },
  { 
    name: "Eco Fashion", 
    logo: "/logos/ecofashion.svg",
    description: "Colecciones sostenibles con certificaciones éticas"
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 items-center justify-items-center">
          {companies.map((company) => (
            <div 
              key={company.name} 
              className="group flex flex-col items-center justify-center p-4 rounded-xl hover:bg-white/80 transition-all duration-300 cursor-pointer"
              title={company.description}
            >
              <div className="relative w-24 h-12 mb-2">
                <Image
                  src={company.logo}
                  alt={`Logo de ${company.name}`}
                  fill
                  className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300 filter"
                />
              </div>
              <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors duration-300 text-center">
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
