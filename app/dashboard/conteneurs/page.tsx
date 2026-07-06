import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase'
import ConteneurPageClient from './ConteneurPageClient'

type SearchParams = Promise<{ statut?: string; taille?: string }>

export default async function ConteneursPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { statut, taille } = await searchParams

  let query = supabase
    .from('conteneurs')
    .select('id, numero_serie, taille, statut, localisation_actuelle')
    .order('numero_serie')

  if (statut) query = query.eq('statut', statut)
  if (taille) query = query.eq('taille', taille)

  const { data: conteneurs, error } = await query

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {error ? (
        <div className="rounded-lg bg-red-50 border border-red-200 px-6 py-4 text-sm text-red-700">
          Erreur lors du chargement des conteneurs : {error.message}
        </div>
      ) : (
        <ConteneurPageClient
          conteneurs={conteneurs ?? []}
          currentStatut={statut ?? ''}
          currentTaille={taille ?? ''}
        />
      )}
    </main>
  )
}
