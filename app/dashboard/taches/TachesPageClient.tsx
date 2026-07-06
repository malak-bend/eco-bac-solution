'use client'

import { useState } from 'react'
import NouvelleTacheModal from './NouvelleTacheModal'
import TachesFilters from './TachesFilters'

const STATUT_STYLES: Record<string, string> = {
  en_attente: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  en_cours: 'bg-blue-50 text-blue-700 border border-blue-200',
  completee: 'bg-green-50 text-green-700 border border-green-200',
  annulee: 'bg-red-50 text-red-700 border border-red-200',
}

const STATUT_LABELS: Record<string, string> = {
  en_attente: 'En attente',
  en_cours: 'En cours',
  completee: 'Complétée',
  annulee: 'Annulée',
}

const TYPE_STYLES: Record<string, string> = {
  livraison: 'bg-blue-50 text-blue-700 border border-blue-200',
  ramassage: 'bg-orange-50 text-orange-700 border border-orange-200',
}

export type Tache = {
  id: string
  date_planifiee: string
  client: string
  adresse: string
  type: string
  conteneur: string
  chauffeur: string
  statut: string
}

export type Chauffeur = {
  id: string
  prenom: string
  nom: string
}

export type Conteneur = {
  id: string
  numero_serie: string
  taille: string
}

export type Client = {
  id: string
  nom: string
}

interface Props {
  taches: Tache[]
  currentStatut: string
  currentType: string
  chauffeurs: Chauffeur[]
  conteneurs: Conteneur[]
  clients: Client[]
}

export default function TachesPageClient({ taches, currentStatut, currentType, chauffeurs, conteneurs, clients }: Props) {
  const [modalOpen, setModalOpen] = useState(false)

  const formatDate = (iso: string) => {
    if (!iso) return '—'
    const [y, m, d] = iso.split('-')
    return `${d}/${m}/${y}`
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2e4a]">Gestion des tâches</h1>
          <p className="text-gray-500 text-sm mt-0.5">{taches.length} tâche{taches.length !== 1 ? 's' : ''} affichée{taches.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 self-start sm:self-auto rounded-lg bg-[#4CAF50] hover:bg-[#43a047] text-white font-semibold px-4 py-2.5 text-sm transition shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5z" />
          </svg>
          Nouvelle tâche
        </button>
      </div>

      {/* Filters */}
      <div className="mb-4">
        <TachesFilters currentStatut={currentStatut} currentType={currentType} />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {taches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-400" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">Aucune tâche trouvée</p>
              <p className="text-gray-400 text-sm mt-1">
                {currentStatut || currentType
                  ? 'Essayez de modifier les filtres.'
                  : 'Créez votre première tâche avec le bouton ci-dessus.'}
              </p>
            </div>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['Date', 'Client', 'Adresse', 'Type', 'Conteneur', 'Chauffeur', 'Statut'].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {taches.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 whitespace-nowrap text-gray-700 font-medium">
                      {formatDate(t.date_planifiee)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-800 font-medium">
                      {t.client}
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate" title={t.adresse}>
                      {t.adresse}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${TYPE_STYLES[t.type] ?? 'bg-gray-100 text-gray-600'}`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                      {t.conteneur}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                      {t.chauffeur}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUT_STYLES[t.statut] ?? 'bg-gray-100 text-gray-600'}`}>
                        {STATUT_LABELS[t.statut] ?? t.statut}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <NouvelleTacheModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        chauffeurs={chauffeurs}
        conteneurs={conteneurs}
        clients={clients}
      />
    </>
  )
}
