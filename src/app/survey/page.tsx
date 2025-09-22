import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import SurveyClient from './survey-client'

export default async function SurveyPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  if (session.user.role !== 'USER') {
    redirect('/unauthorized')
  }

  return <SurveyClient />
}
