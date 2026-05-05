'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { mettreAJourStatut } from './actions'

export type TacheChauffeur = {
  id: string
  adresse_livraison: string
  type: string
  statut: string
  ordre_sequence: number
  clients: { nom: string } | null
  conteneurs: { numero_serie: string; taille: string } | null
}

const TERMINES = new Set(['livre', 'ramasse', 'obstacle'])
const estTermine = (s: string) => TERMINES.has(s)

const STATUT_LABEL: Record<string, string> = {
  en_attente: 'En attente',
  en_route_livraison: 'En route — Livraison',
  en_route_ramassage: 'En route — Ramassage',
  livre: 'Livré ✓',
  ramasse: 'Ramassé ✓',
  obstacle: 'Obstacle ⚠',
}

type ActionPendante = {
  tacheId: string
  statut: string
  requiresPhoto: boolean
  requiresNote: boolean
}

function IconCheck() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
      <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
  )
}

function IconLock() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
      <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1zm3 8V5.5a3 3 0 1 0-6 0V9h6z" clipRule="evenodd" />
    </svg>
  )
}

function IconCamera() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
      <path fillRule="evenodd" d="M1 8a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 8.07 3h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 16.07 6H17a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8zm13.5 3a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0zM10 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" clipRule="evenodd" />
    </svg>
  )
}

function Spinner() {
  return (
    <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}

interface ActionPanelProps {
  action: ActionPendante
  isPending: boolean
  onConfirm: (photo: File | null, note: string) => void
  onCancel: () => void
}

function ActionPanel({ action, isPending, onConfirm, onCancel }: ActionPanelProps) {
  const [photo, setPhoto] = useState<File | null>(null)
  const [note, setNote] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleConfirm = () => {
    if (action.requiresPhoto && !photo) {
      setLocalError('Une photo est obligatoire.')
      return
    }
    if (action.requiresNote && !note.trim()) {
      setLocalError('Une note explicative est obligatoire.')
      return
    }
    setLocalError(null)
    onConfirm(photo, note)
  }

  const statutLabel = STATUT_LABEL[action.statut] ?? action.statut

  return (
    <div className="mt-3 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-4 space-y-3">
      <p className="text-sm font-semibold text-gray-700">
        Confirmer : <span className="text-[#1a2e4a]">{statutLabel}</span>
      </p>

      {action.requiresPhoto && (
        <div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className={`w-full flex items-center justify-center gap-2 rounded-xl border-2 py-4 text-sm font-semibold transition ${
              photo
                ? 'border-green-400 bg-green-50 text-green-700'
                : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
            }`}
          >
            <IconCamera />
            {photo ? `Photo sélectionnée : ${photo.name}` : 'Prendre / choisir une photo'}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
          />
        </div>
      )}

      {action.requiresNote && (
        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Décrivez l'obstacle ou la raison d'impossibilité…"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm resize-none focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-200 transition"
        />
      )}

      {localError && (
        <p className="text-sm text-red-600 font-medium">{localError}</p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="flex-1 rounded-xl border border-gray-300 py-3.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition"
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={isPending}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#1a2e4a] py-3.5 text-sm font-semibold text-white hover:bg-[#243d61] disabled:opacity-50 transition"
        >
          {isPending ? <Spinner /> : 'Confirmer'}
        </button>
      </div>
    </div>
  )
}

interface BoutonProps {
  label: string
  couleur: 'bleu' | 'vert' | 'rouge'
  onClick: () => void
  disabled: boolean
  isPending: boolean
  actif: boolean
}

function Bouton({ label, couleur, onClick, disabled, isPending, actif }: BoutonProps) {
  const base = 'w-full flex items-center justify-center gap-2 rounded-xl py-4 text-base font-bold transition active:scale-[.98]'
  const styles = {
    bleu: 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-300',
    vert: 'bg-[#4CAF50] hover:bg-[#43a047] text-white disabled:bg-green-300',
    rouge: 'bg-red-600 hover:bg-red-700 text-white disabled:bg-red-300',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[couleur]} ${actif ? 'ring-4 ring-offset-2 ' + (couleur === 'bleu' ? 'ring-blue-300' : couleur === 'vert' ? 'ring-green-300' : 'ring-red-300') : ''}`}
    >
      {isPending && actif ? <Spinner /> : label}
    </button>
  )
}

export default function ChauffeurInterface({ taches }: { taches: TacheChauffeur[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [actionPendante, setActionPendante] = useState<ActionPendante | null>(null)
  const [erreurGlobale, setErreurGlobale] = useState<string | null>(null)

  const executer = (tacheId: string, statut: string, photo: File | null, note: string) => {
    setErreurGlobale(null)
    startTransition(async () => {
      const formData = new FormData()
      if (photo) formData.set('photo', photo)
      if (note.trim()) formData.set('note', note.trim())
      const result = await mettreAJourStatut(tacheId, statut, undefined, formData)
      if (result?.error) {
        setErreurGlobale(result.error)
      } else {
        setActionPendante(null)
        router.refresh()
      }
    })
  }

  const demanderAction = (tacheId: string, statut: string, requiresPhoto: boolean, requiresNote: boolean) => {
    if (requiresPhoto || requiresNote) {
      setActionPendante({ tacheId, statut, requiresPhoto, requiresNote })
    } else {
      executer(tacheId, statut, null, '')
    }
  }

  if (taches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center px-4">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <IconCheck />
        </div>
        <p className="text-xl font-bold text-gray-700">Aucune tâche aujourd'hui</p>
        <p className="text-gray-400 mt-2 text-sm">Bonne journée !</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 pb-10">
      {erreurGlobale && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-medium">
          {erreurGlobale}
        </div>
      )}

      {taches.map((tache, index) => {
        const precedente = index > 0 ? taches[index - 1] : null
        const bloquee = precedente !== null && !estTermine(precedente.statut)
        const terminee = estTermine(tache.statut)
        const estActive = !bloquee && !terminee
        const isPendingCette = isPending && actionPendante?.tacheId === tache.id
        const showPanel = actionPendante?.tacheId === tache.id

        return (
          <div
            key={tache.id}
            className={`rounded-2xl border-2 overflow-hidden transition ${
              terminee
                ? 'border-green-300 bg-green-50'
                : bloquee
                ? 'border-gray-200 bg-white opacity-60'
                : 'border-[#1a2e4a] bg-white shadow-md'
            }`}
          >
            {/* Task header */}
            <div className={`px-5 py-4 ${terminee ? 'bg-green-100' : bloquee ? 'bg-gray-50' : 'bg-[#1a2e4a]'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold rounded-full px-2.5 py-1 ${terminee ? 'bg-green-200 text-green-800' : bloquee ? 'bg-gray-200 text-gray-600' : 'bg-white/20 text-white'}`}>
                    #{tache.ordre_sequence}
                  </span>
                  <span className={`text-xs font-semibold rounded-full px-2.5 py-1 ${
                    tache.type === 'livraison'
                      ? terminee ? 'bg-blue-100 text-blue-700' : bloquee ? 'bg-blue-50 text-blue-500' : 'bg-blue-400/30 text-blue-100'
                      : terminee ? 'bg-orange-100 text-orange-700' : bloquee ? 'bg-orange-50 text-orange-500' : 'bg-orange-400/30 text-orange-100'
                  }`}>
                    {tache.type === 'livraison' ? 'Livraison' : 'Ramassage'}
                  </span>
                </div>
                {terminee && (
                  <span className="flex items-center gap-1 text-green-700 text-xs font-bold">
                    <IconCheck /> {STATUT_LABEL[tache.statut] ?? tache.statut}
                  </span>
                )}
                {bloquee && (
                  <span className="flex items-center gap-1 text-gray-400 text-xs font-semibold">
                    <IconLock /> Bloquée
                  </span>
                )}
              </div>
            </div>

            {/* Task body */}
            <div className="px-5 py-4">
              <p className={`text-xl font-bold leading-tight mb-1 ${terminee ? 'text-green-800' : bloquee ? 'text-gray-500' : 'text-[#1a2e4a]'}`}>
                {tache.clients?.nom ?? '—'}
              </p>
              <p className={`text-sm mb-1 ${terminee ? 'text-green-700' : bloquee ? 'text-gray-400' : 'text-gray-600'}`}>
                {tache.adresse_livraison}
              </p>
              <p className={`text-xs font-medium ${terminee ? 'text-green-600' : bloquee ? 'text-gray-400' : 'text-gray-400'}`}>
                Conteneur : {tache.conteneurs ? `${tache.conteneurs.numero_serie} — ${tache.conteneurs.taille}` : '—'}
              </p>

              {/* Blocking message */}
              {bloquee && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2">
                  <IconLock />
                  <p className="text-xs font-semibold text-amber-700">
                    Complétez la tâche #{precedente!.ordre_sequence} d'abord
                  </p>
                </div>
              )}

              {/* Action buttons — active tasks only */}
              {estActive && (
                <div className="mt-4 space-y-2.5">
                  <Bouton
                    label="En route — Livraison"
                    couleur="bleu"
                    disabled={isPending}
                    isPending={isPendingCette}
                    actif={actionPendante === null && tache.statut === 'en_route_livraison'}
                    onClick={() => demanderAction(tache.id, 'en_route_livraison', false, false)}
                  />
                  <Bouton
                    label="En route — Ramassage"
                    couleur="bleu"
                    disabled={isPending}
                    isPending={isPendingCette}
                    actif={actionPendante === null && tache.statut === 'en_route_ramassage'}
                    onClick={() => demanderAction(tache.id, 'en_route_ramassage', false, false)}
                  />
                  <Bouton
                    label="Livré ✓"
                    couleur="vert"
                    disabled={isPending}
                    isPending={isPendingCette}
                    actif={showPanel && actionPendante?.statut === 'livre'}
                    onClick={() => demanderAction(tache.id, 'livre', true, false)}
                  />
                  <Bouton
                    label="Ramassé ✓"
                    couleur="vert"
                    disabled={isPending}
                    isPending={isPendingCette}
                    actif={actionPendante === null && tache.statut === 'ramasse'}
                    onClick={() => demanderAction(tache.id, 'ramasse', false, false)}
                  />
                  <Bouton
                    label="Obstacle / Impossible"
                    couleur="rouge"
                    disabled={isPending}
                    isPending={isPendingCette}
                    actif={showPanel && actionPendante?.statut === 'obstacle'}
                    onClick={() => demanderAction(tache.id, 'obstacle', true, true)}
                  />

                  {/* Inline confirmation panel */}
                  {showPanel && actionPendante && (
                    <ActionPanel
                      action={actionPendante}
                      isPending={isPending}
                      onConfirm={(photo, note) => executer(tache.id, actionPendante.statut, photo, note)}
                      onCancel={() => setActionPendante(null)}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
