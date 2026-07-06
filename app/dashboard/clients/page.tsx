import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase'
import DashboardHeader from '@/components/DashboardHeader'
import ClientsPageClient from './ClientsPageClient'

export default async function ClientsPage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: clients, error } = await supabase
    .from('clients')
    .select('id, nom, email, telephone, ville, type_client, created_at')
    .order('nom')

  const email = user.email ?? ''
  const role = user.app_metadata?.role as string | undefined

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader email={email} role={role} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {error ? (
          <div className="rounded-lg bg-red-50 border border-red-200 px-6 py-4 text-sm text-red-700">
            Erreur lors du chargement des clients : {error.message}
          </div>
        ) : (
          <ClientsPageClient clients={clients ?? []} />
        )}
      </main>
    </div>
  )
}
