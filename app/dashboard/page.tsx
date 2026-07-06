import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase'


const STATS = [
  { label: 'Collectes aujourd\'hui', value: '—', icon: TruckIcon },
  { label: 'Clients actifs', value: '—', icon: UsersIcon },
  { label: 'Chauffeurs en service', value: '—', icon: IdCardIcon },
  { label: 'Collectes ce mois', value: '—', icon: CalendarIcon },
]

function TruckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
      <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 1 1 6 0h3a3 3 0 1 1 6 0h.375c1.035 0 1.875-.84 1.875-1.875V12.75c0-.621-.186-1.184-.504-1.654l-2.25-3.375A1.875 1.875 0 0 0 16.875 7.5H15V15h-1.5z" />
      <path d="M8.25 19.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0zm10.5 0a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0z" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
      <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0zM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0zM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003z" />
    </svg>
  )
}

function IdCardIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
      <path fillRule="evenodd" d="M4.5 3.75a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V6.75a3 3 0 0 0-3-3h-15zm4.125 3a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5zm-3.873 8.703a4.126 4.126 0 0 1 7.746 0 .75.75 0 0 1-.351.92 7.47 7.47 0 0 1-3.522.877 7.47 7.47 0 0 1-3.522-.877.75.75 0 0 1-.351-.92zM15 8.25a.75.75 0 0 0 0 1.5h3.75a.75.75 0 0 0 0-1.5H15zM14.25 12a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H15a.75.75 0 0 1-.75-.75zm.75 2.25a.75.75 0 0 0 0 1.5h3.75a.75.75 0 0 0 0-1.5H15z" clipRule="evenodd" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
      <path d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zM8.25 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zM9.75 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zM10.5 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zM12 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zM12.75 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zM14.25 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zM15 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zM16.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zM15 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zM16.5 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5z" />
      <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5z" clipRule="evenodd" />
    </svg>
  )
}

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const today = new Date().toLocaleDateString('fr-CA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1a2e4a]">Tableau de bord</h1>
          <p className="text-gray-500 text-sm mt-1 capitalize">{today}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-5 flex items-center gap-4"
            >
              <div className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-full bg-[#4CAF50]/10 text-[#4CAF50]">
                <Icon />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1a2e4a]">{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Content placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent activity */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-[#1a2e4a]">Collectes récentes</h2>
            </div>
            <div className="px-6 py-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <TruckIcon />
              </div>
              <p className="text-gray-400 text-sm">Aucune collecte à afficher</p>
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-[#1a2e4a]">Actions rapides</h2>
            </div>
            <div className="p-4 flex flex-col gap-2">
              <Link
                href="/dashboard/taches"
                className="w-full text-left rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700 hover:border-[#4CAF50] hover:text-[#4CAF50] transition"
              >
                Planifier une tâche
              </Link>
              <Link
                href="/dashboard/clients"
                className="w-full text-left rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700 hover:border-[#4CAF50] hover:text-[#4CAF50] transition"
              >
                Gérer les clients
              </Link>
              <Link
                href="/dashboard/conteneurs"
                className="w-full text-left rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700 hover:border-[#4CAF50] hover:text-[#4CAF50] transition"
              >
                Gérer les conteneurs
              </Link>
              <button
                disabled
                className="w-full text-left rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700 hover:border-[#4CAF50] hover:text-[#4CAF50] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Générer un rapport
              </button>
            </div>
          </div>
        </div>
      </main>
  )
}
