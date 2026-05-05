'use client'

import { useRouter, usePathname } from 'next/navigation'

const STATUTS = [
  { value: '', label: 'Tous les statuts' },
  { value: 'en_attente', label: 'En attente' },
  { value: 'en_cours', label: 'En cours' },
  { value: 'completee', label: 'Complétée' },
  { value: 'annulee', label: 'Annulée' },
]

const TYPES = [
  { value: '', label: 'Tous les types' },
  { value: 'livraison', label: 'Livraison' },
  { value: 'ramassage', label: 'Ramassage' },
]

interface Props {
  currentStatut: string
  currentType: string
}

export default function TachesFilters({ currentStatut, currentType }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  const update = (key: 'statut' | 'type', value: string) => {
    const params = new URLSearchParams()
    const statut = key === 'statut' ? value : currentStatut
    const type = key === 'type' ? value : currentType
    if (statut) params.set('statut', statut)
    if (type) params.set('type', type)
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
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      <select
        value={currentType}
        onChange={(e) => update('type', e.target.value)}
        className={selectClass}
      >
        {TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>
    </div>
  )
}
