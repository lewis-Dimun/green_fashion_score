jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

jest.mock('@auth/prisma-adapter', () => ({
  PrismaAdapter: jest.fn(),
}))

jest.mock('@/lib/auth', () => ({
  authOptions: {},
}))

jest.mock('@/lib/prisma', () => ({
  prisma: {
    fashionScore: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}))

const { getServerSession } = require('next-auth')
const { prisma } = require('@/lib/prisma')

let GET: typeof import('@/app/api/fashion-scores/route').GET
let POST: typeof import('@/app/api/fashion-scores/route').POST

describe('fashion-scores API', () => {
  const mockSession = getServerSession as jest.MockedFunction<typeof getServerSession>
  const mockFashionScore = prisma.fashionScore as jest.Mocked<typeof prisma.fashionScore>

  beforeAll(async () => {
    const routes = await import('@/app/api/fashion-scores/route')
    GET = routes.GET
    POST = routes.POST
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('filters scores by user when session is not admin', async () => {
      mockSession.mockResolvedValue({ user: { id: 'user-1', role: 'USER' } } as any)
      mockFashionScore.findMany.mockResolvedValue([] as any)

      const response = await GET()
      expect(response.status).toBe(200)
      expect(mockFashionScore.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        include: expect.any(Object),
        orderBy: { createdAt: 'desc' },
      })
    })

    it('omits where clause for admin sessions', async () => {
      mockSession.mockResolvedValue({ user: { id: 'admin-1', role: 'ADMIN' } } as any)
      mockFashionScore.findMany.mockResolvedValue([] as any)

      await GET()
      expect(mockFashionScore.findMany).toHaveBeenCalledWith({
        where: undefined,
        include: expect.any(Object),
        orderBy: { createdAt: 'desc' },
      })
    })
  })

  describe('POST', () => {
    it('accepts zero scores and clamps negative values to zero', async () => {
      mockSession.mockResolvedValue({ user: { id: 'user-2', role: 'USER' } } as any)
      mockFashionScore.create.mockResolvedValue({ id: 'fs-1' } as any)

      const request = new Request('http://localhost/api/fashion-scores', {
        method: 'POST',
        body: JSON.stringify({ brand: 'Brand', score: 0, category: 'Tops' }),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request as any)
      expect(response.status).toBe(201)
      expect(mockFashionScore.create).toHaveBeenCalledWith({
        data: {
          brand: 'Brand',
          score: 0,
          category: 'Tops',
          description: null,
          userId: 'user-2',
        },
        include: expect.any(Object),
      })
    })
  })
})
