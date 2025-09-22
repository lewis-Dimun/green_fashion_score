import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { parseStringPromise } from 'xml2js'

type XmlOption = {
  _: string
  $: { points: string }
}

type XmlQuestion = {
  text: string
  maxPoints: string
  options?: {
    option: XmlOption | XmlOption[]
  }
}

type XmlPillar = {
  name: string
  description?: string
  maxPoints: string
  weight: string
  questions?: {
    question: XmlQuestion | XmlQuestion[]
  }
}

type XmlRoot = {
  pillars: {
    pillar: XmlPillar | XmlPillar[]
  }
}

const prisma = new PrismaClient()

const INITIAL_DATA_XML = `
<pillars>
  <pillar>
    <name>People</name>
    <description>Impacto Social y Laboral. Centrado en bienestar social, laboral y de gobernanza.</description>
    <maxPoints>44</maxPoints>
    <weight>0.20</weight>
    <questions>
      <question>
        <text>Responsabilidad Social</text>
        <maxPoints>4</maxPoints>
        <options>
          <option points="4">Certificación ética externa (Fair Trade, SA8000, etc.)</option>
          <option points="3">Certificación parcial o en proceso</option>
          <option points="2">Auditorías puntuales sin certificación completa</option>
          <option points="1">Declaraciones básicas sobre responsabilidad</option>
          <option points="0">Sin compromiso ni evidencia</option>
        </options>
      </question>
      <question>
        <text>Lugar de Producción</text>
        <maxPoints>4</maxPoints>
        <options>
          <option points="4">Producción local/regional (Europa), trazabilidad completa</option>
          <option points="2">Producción fuera de Europa con trazabilidad parcial</option>
          <option points="1">Producción fuera de Europa (Asia, Latam) con riesgos éticos</option>
          <option points="0">Producción en zonas de alto riesgo sin trazabilidad</option>
        </options>
      </question>
    </questions>
  </pillar>
</pillars>
`

function ensureArray<T>(value: T | T[] | undefined): T[] {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

async function seedUsers() {
  console.log('Seeding default users...')

  const users = [
    {
      email: 'admin@example.com',
      name: 'Admin User',
      role: UserRole.ADMIN,
      password: 'Admin123!'
    },
    {
      email: 'user@example.com',
      name: 'Survey User',
      role: UserRole.USER,
      password: 'User123!'
    }
  ]

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 12)

    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        role: user.role,
        password: hashedPassword,
      },
      create: {
        email: user.email,
        name: user.name,
        role: user.role,
        password: hashedPassword,
      }
    })
  }
}

async function seedFromXml(xml: string) {
  const parsed = (await parseStringPromise(xml, {
    explicitArray: false,
    trim: true,
  })) as XmlRoot

  const pillarNodes = ensureArray(parsed.pillars?.pillar)

  for (const pillarNode of pillarNodes) {
    const name = pillarNode.name?.trim()
    if (!name) {
      console.warn('Skipping pillar without name', pillarNode)
      continue
    }

    const description = pillarNode.description?.trim() || null
    const maxPoints = Number(pillarNode.maxPoints ?? 0)
    const weight = Number(pillarNode.weight ?? 0)

    const pillarRecord = await prisma.pillar.upsert({
      where: { name },
      update: { description, maxPoints, weight },
      create: { name, description, maxPoints, weight },
    })

    const questionNodes = ensureArray(pillarNode.questions?.question)

    for (const questionNode of questionNodes) {
      const text = questionNode.text?.trim()
      if (!text) {
        console.warn(`Skipping question without text in pillar ${name}`)
        continue
      }

      const questionMaxPoints = Number(questionNode.maxPoints ?? 0)

      const questionRecord = await prisma.question.upsert({
        where: {
          pillarId_text: {
            pillarId: pillarRecord.id,
            text,
          },
        },
        update: { maxPoints: questionMaxPoints },
        create: {
          text,
          maxPoints: questionMaxPoints,
          pillarId: pillarRecord.id,
        },
      })

      const optionNodes = ensureArray(questionNode.options?.option)

      for (const optionNode of optionNodes) {
        const label = (typeof optionNode === 'string' ? optionNode : optionNode._)?.trim()
        if (!label) {
          console.warn(`Skipping option without label for question ${text}`)
          continue
        }

        const pointsValue = typeof optionNode === 'string'
          ? 0
          : Number(optionNode.$?.points ?? 0)

        await prisma.option.upsert({
          where: {
            questionId_label: {
              questionId: questionRecord.id,
              label,
            },
          },
          update: { points: pointsValue },
          create: {
            label,
            points: pointsValue,
            questionId: questionRecord.id,
          },
        })
      }
    }
  }
}

async function main() {
  await seedUsers()
  console.log('Seeding pillars, questions and options from XML...')
  await seedFromXml(INITIAL_DATA_XML)
  console.log('Seed completed successfully.')
}

main()
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
