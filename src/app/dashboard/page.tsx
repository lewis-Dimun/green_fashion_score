import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import AdminDashboardClient from './admin-dashboard-client'
import UserDashboardClient from './user-dashboard-client'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  if (session.user.role === 'ADMIN') {
    return <AdminDashboardClient user={session.user} />
  }

  return <UserDashboardClient />
}
