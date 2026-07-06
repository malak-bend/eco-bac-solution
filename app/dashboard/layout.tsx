import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase'
import DashboardHeader from '@/components/DashboardHeader'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const email = user.email ?? ''
  const role = user.app_metadata?.role as string | undefined

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader email={email} role={role} showNav />
      {children}
    </div>
  )
}
