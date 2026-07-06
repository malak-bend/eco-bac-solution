'use client'

import { useState } from 'react'
import NouveauClientModal from './NouveauClientModal'

export type Client = {
  id: string
  nom: string
  email: string | null
  telephone: string | null
  ville: string | null
  type_client: string | null
  created_at: string
}

const TYPE_STYLES: Record<string, string> = {
  résidentiel: 'bg-blue-50 text-blue-700 border border-blue-200',
  commercial:  'bg-purple-50 text-purple-700 border border-purple-200',
  industriel:  'bg-orange-50 text-orange-700 border border-orange-200',
  municipal:   'bg-teal-50 text-teal-700 border border-teal-200',
}

interface Props {
  clients: Client[]
}

export default function ClientsPageClient({ clients }: Props) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2e4a]">Gestion des clients</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {clients.length} client{clients.length !== 1 ? 's' : ''} enregistré{clients.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 self-start sm:self-auto rounded-lg bg-[#4CAF50] hover:bg-[#43a047] text-white font-semibold px-4 py-2.5 text-sm transition shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5z" />
          </svg>
          Nouveau client
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {clients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-400" aria-hidden="true">
                  <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0zM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0zM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">Aucun client trouvé</p>
              <p className="text-gray-400 text-sm mt-1">
                Créez votre premier client avec le bouton ci-dessus.
              </p>
            </div>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['Nom', 'Courriel', 'Téléphone', 'Ville', 'Type'].map((col) => (
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
                {clients.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                      {c.nom}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                      {c.email ? (
                        <a href={`mailto:${c.email}`} className="hover:text-[#4CAF50] transition">
                          {c.email}
                        </a>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                      {c.telephone ?? <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                      {c.ville ?? <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {c.type_client ? (
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${TYPE_STYLES[c.type_client] ?? 'bg-gray-100 text-gray-600'}`}>
                          {c.type_client}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <NouveauClientModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
