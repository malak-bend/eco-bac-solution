import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase'
import DashboardHeader from '@/components/DashboardHeader'
import TachesPageClient from './TachesPageClient'

type SearchParams = Promise<{ statut?: string; type?: string }>

export default async function TachesPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { statut, type } = await searchParams

  let query = supabase
    .from('taches')
    .select('*')
    .order('date_planifiee', { ascending: false })

  if (statut) query = query.eq('statut', statut)
  if (type) query = query.eq('type', type)

  const [
    { data: taches, error },
    { data: chauffeurs },
    { data: conteneurs },
  ] = await Promise.all([
    query,
    supabase
      .from('utilisateurs')
      .select('id, prenom, nom')
      .eq('role', 'chauffeur')
      .order('nom'),
    supabase
      .from('conteneurs')
      .select('id, numero_serie, taille')
      .order('numero_serie'),
  ])

  const email = user.email ?? ''
  const role = user.app_metadata?.role as string | undefined

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader email={email} role={role} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {error ? (
          <div className="rounded-lg bg-red-50 border border-red-200 px-6 py-4 text-sm text-red-700">
            Erreur lors du chargement des tâches : {error.message}
          </div>
        ) : (
          <TachesPageClient
            taches={taches ?? []}
            currentStatut={statut ?? ''}
            currentType={type ?? ''}
            chauffeurs={chauffeurs ?? []}
            conteneurs={conteneurs ?? []}
          />
        )}
      </main>
    </div>
  )
}
