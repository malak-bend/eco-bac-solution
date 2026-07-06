'use client'

import { useState } from 'react'
import NouveauConteneurModal from './NouveauConteneurModal'
import ConteneurFilters from './ConteneurFilters'

export type Conteneur = {
  id: string
  numero_serie: string
  taille: string
  statut: string
  localisation_actuelle: string | null
}

const STATUT_STYLES: Record<string, string> = {
  disponible:     'bg-green-50 text-green-700 border border-green-200',
  en_service:     'bg-blue-50 text-blue-700 border border-blue-200',
  en_maintenance: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  hors_service:   'bg-red-50 text-red-700 border border-red-200',
}

const STATUT_LABELS: Record<string, string> = {
  disponible:     'Disponible',
  en_service:     'En service',
  en_maintenance: 'En maintenance',
  hors_service:   'Hors service',
}

interface Props {
  conteneurs: Conteneur[]
  currentStatut: string
  currentTaille: string
}

export default function ConteneurPageClient({ conteneurs, currentStatut, currentTaille }: Props) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2e4a]">Gestion des conteneurs</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {conteneurs.length} conteneur{conteneurs.length !== 1 ? 's' : ''} affiché{conteneurs.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 self-start sm:self-auto rounded-lg bg-[#4CAF50] hover:bg-[#43a047] text-white font-semibold px-4 py-2.5 text-sm transition shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5z" />
          </svg>
          Nouveau conteneur
        </button>
      </div>

      {/* Filters */}
      <div className="mb-4">
        <ConteneurFilters currentStatut={currentStatut} currentTaille={currentTaille} />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {conteneurs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-400" aria-hidden="true">
                  <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 1 1 6 0h3a3 3 0 1 1 6 0h.375c1.035 0 1.875-.84 1.875-1.875V12.75c0-.621-.186-1.184-.504-1.654l-2.25-3.375A1.875 1.875 0 0 0 16.875 7.5H15V15h-1.5z" />
                  <path d="M8.25 19.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0zm10.5 0a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">Aucun conteneur trouvé</p>
              <p className="text-gray-400 text-sm mt-1">
                {currentStatut || currentTaille
                  ? 'Essayez de modifier les filtres.'
                  : 'Créez votre premier conteneur avec le bouton ci-dessus.'}
              </p>
            </div>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['Numéro de série', 'Taille', 'Statut', 'Localisation'].map((col) => (
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
                {conteneurs.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 whitespace-nowrap font-mono font-medium text-gray-900">
                      {c.numero_serie}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                      {c.taille}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUT_STYLES[c.statut] ?? 'bg-gray-100 text-gray-600'}`}>
                        {STATUT_LABELS[c.statut] ?? c.statut}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[240px] truncate" title={c.localisation_actuelle ?? ''}>
                      {c.localisation_actuelle ?? <span className="text-gray-300">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <NouveauConteneurModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
