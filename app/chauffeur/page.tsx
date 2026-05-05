import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase'
import DashboardHeader from '@/components/DashboardHeader'
import ChauffeurInterface from './ChauffeurInterface'

export default async function ChauffeurPage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

  // Tâches d'aujourd'hui pour ce chauffeur, triées par séquence
  // La colonne "chauffeur" stocke l'UUID de l'utilisateur connecté
  const { data: taches, error } = await supabase
    .from('taches')
    .select('id, adresse_livraison, type, statut, ordre_sequence, clients(nom), conteneurs(numero_serie, taille)')
    .eq('chauffeur_id', user.id)
    .eq('date_planifiee', today)
    .order('ordre_sequence', { ascending: true })

  const email = user.email ?? ''
  const role = user.app_metadata?.role as string | undefined

  const todayLabel = new Date().toLocaleDateString('fr-CA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader email={email} role={role} />

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Date banner */}
        <div className="rounded-2xl bg-[#1a2e4a] px-5 py-4 mb-6 text-white">
          <p className="text-[#4CAF50] text-xs font-bold uppercase tracking-widest mb-1">
            Ma journée
          </p>
          <p className="text-lg font-semibold capitalize">{todayLabel}</p>
          {!error && (
            <p className="text-sm text-white/70 mt-1">
              {taches?.length ?? 0} tâche{(taches?.length ?? 0) !== 1 ? 's' : ''} assignée{(taches?.length ?? 0) !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {error ? (
          <div className="rounded-xl bg-red-50 border border-red-200 px-5 py-4 text-sm text-red-700 font-medium">
            Erreur lors du chargement des tâches : {error.message}
          </div>
        ) : (
          <ChauffeurInterface taches={taches ?? []} />
        )}
      </main>
    </div>
  )
}
