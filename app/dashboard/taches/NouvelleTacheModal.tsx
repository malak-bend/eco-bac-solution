'use client'

import { useEffect, useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { creerTache, type TacheState } from './actions'
import type { Chauffeur, Conteneur } from './TachesPageClient'

const TYPES = [
  { value: 'livraison', label: 'Livraison' },
  { value: 'ramassage', label: 'Ramassage' },
]

const STATUTS = [
  { value: 'en_attente', label: 'En attente' },
  { value: 'en_cours', label: 'En cours' },
  { value: 'completee', label: 'Complétée' },
  { value: 'annulee', label: 'Annulée' },
]

const labelClass = 'block text-sm font-medium text-[#1a2e4a] mb-1'
const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#4CAF50] focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30 transition'

interface Props {
  open: boolean
  onClose: () => void
  chauffeurs: Chauffeur[]
  conteneurs: Conteneur[]
}

function ModalForm({
  onClose,
  chauffeurs,
  conteneurs,
}: {
  onClose: () => void
  chauffeurs: Chauffeur[]
  conteneurs: Conteneur[]
}) {
  const router = useRouter()
  const [state, formAction, pending] = useActionState<TacheState, FormData>(
    creerTache,
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
          <label htmlFor="date" className={labelClass}>Date *</label>
          <input id="date" name="date" type="date" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="type" className={labelClass}>Type *</label>
          <select id="type" name="type" required className={inputClass}>
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="client" className={labelClass}>Client *</label>
          <input id="client" name="client" type="text" required className={inputClass} placeholder="Nom du client" />
        </div>
        <div>
          <label htmlFor="conteneur" className={labelClass}>Conteneur *</label>
          <select id="conteneur" name="conteneur" required className={inputClass}>
            <option value="">— Sélectionner —</option>
            {conteneurs.map((c) => (
              <option key={c.id} value={c.id}>
                {c.numero_serie} — {c.taille}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="adresse" className={labelClass}>Adresse *</label>
        <input id="adresse" name="adresse" type="text" required className={inputClass} placeholder="123 rue Exemple, Montréal" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="chauffeur" className={labelClass}>Chauffeur *</label>
          <select id="chauffeur" name="chauffeur" required className={inputClass}>
            <option value="">— Sélectionner —</option>
            {chauffeurs.map((c) => (
              <option key={c.id} value={c.id}>
                {c.prenom} {c.nom}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="statut" className={labelClass}>Statut</label>
          <select id="statut" name="statut" className={inputClass}>
            {STATUTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
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
            'Créer la tâche'
          )}
        </button>
      </div>
    </form>
  )
}

export default function NouvelleTacheModal({ open, onClose, chauffeurs, conteneurs }: Props) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-[#1a2e4a]">Nouvelle tâche</h2>
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
          <ModalForm onClose={onClose} chauffeurs={chauffeurs} conteneurs={conteneurs} />
        </div>
      </div>
    </div>
  )
}
