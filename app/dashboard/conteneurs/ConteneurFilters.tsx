'use client'

import { useRouter, usePathname } from 'next/navigation'

const STATUTS = [
  { value: '', label: 'Tous les statuts' },
  { value: 'disponible',      label: 'Disponible' },
  { value: 'en_service',      label: 'En service' },
  { value: 'en_maintenance',  label: 'En maintenance' },
  { value: 'hors_service',    label: 'Hors service' },
]

const TAILLES = [
  { value: '', label: 'Toutes les tailles' },
  { value: '10 verges', label: '10 verges' },
  { value: '14 verges', label: '14 verges' },
  { value: '20 verges', label: '20 verges' },
  { value: '30 verges', label: '30 verges' },
  { value: '40 verges', label: '40 verges' },
]

interface Props {
  currentStatut: string
  currentTaille: string
}

export default function ConteneurFilters({ currentStatut, currentTaille }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  const update = (key: 'statut' | 'taille', value: string) => {
    const params = new URLSearchParams()
    const statut = key === 'statut' ? value : currentStatut
    const taille = key === 'taille' ? value : currentTaille
    if (statut) params.set('statut', statut)
    if (taille) params.set('taille', taille)
    const qs = params.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname)
  }

  const selectClass =
    'rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-[#4CAF50] focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30 transition'

  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={currentStatut}
        onChange={(e) => update('statut', e.target.value)}
        className={selectClass}
      >
        {STATUTS.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>

      <select
        value={currentTaille}
        onChange={(e) => update('taille', e.target.value)}
        className={selectClass}
      >
        {TAILLES.map((t) => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>
    </div>
  )
}
