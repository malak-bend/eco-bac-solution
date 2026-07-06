'use client'

import { useEffect, useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { creerConteneur, type ConteneurState } from './actions'

const TAILLES = [
  { value: '10 verges', label: '10 verges' },
  { value: '14 verges', label: '14 verges' },
  { value: '20 verges', label: '20 verges' },
  { value: '30 verges', label: '30 verges' },
  { value: '40 verges', label: '40 verges' },
]

const STATUTS = [
  { value: 'disponible',     label: 'Disponible' },
  { value: 'en_service',     label: 'En service' },
  { value: 'en_maintenance', label: 'En maintenance' },
  { value: 'hors_service',   label: 'Hors service' },
]

const labelClass = 'block text-sm font-medium text-[#1a2e4a] mb-1'
const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#4CAF50] focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30 transition'

interface Props {
  open: boolean
  onClose: () => void
}

function ModalForm({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [state, formAction, pending] = useActionState<ConteneurState, FormData>(
    creerConteneur,
    undefined
  )

  useEffect(() => {
    if (state?.success) {
      onClose()
      router.refresh()
    }
  }, [state?.success, onClose, router])

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <p className="rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="numero_serie" className={labelClass}>Numéro de série *</label>
          <input
            id="numero_serie"
            name="numero_serie"
            type="text"
            required
            className={inputClass}
            placeholder="EBC-001"
          />
        </div>
        <div>
          <label htmlFor="taille" className={labelClass}>Taille *</label>
          <select id="taille" name="taille" required className={inputClass}>
            <option value="">— Sélectionner —</option>
            {TAILLES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="statut" className={labelClass}>Statut</label>
          <select id="statut" name="statut" className={inputClass}>
            {STATUTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="localisation_actuelle" className={labelClass}>Localisation</label>
          <input
            id="localisation_actuelle"
            name="localisation_actuelle"
            type="text"
            className={inputClass}
            placeholder="123 rue Exemple, Montréal"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-2 rounded-lg bg-[#4CAF50] hover:bg-[#43a047] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-4 py-2 text-sm transition"
        >
          {pending ? (
            <>
              <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Création…
            </>
          ) : (
            'Créer le conteneur'
          )}
        </button>
      </div>
    </form>
  )
}

export default function NouveauConteneurModal({ open, onClose }: Props) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-[#1a2e4a]">Nouveau conteneur</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            aria-label="Fermer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-5">
          <ModalForm onClose={onClose} />
        </div>
      </div>
    </div>
  )
}
