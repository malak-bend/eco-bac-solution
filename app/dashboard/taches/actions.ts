'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase'

export type TacheState = { error?: string; success?: boolean } | undefined

export async function creerTache(
  prevState: TacheState,
  formData: FormData
): Promise<TacheState> {
  const supabase = await createSupabaseServerClient()

  const clientId = (formData.get('client_id') as string | null)?.trim()
  const nomClient = (formData.get('nom_client') as string | null)?.trim()

  const insertData: Record<string, unknown> = {
    date_planifiee: formData.get('date'),
    adresse_livraison: formData.get('adresse'),
    type: formData.get('type'),
    conteneur_id: formData.get('conteneur'),
    chauffeur_id: formData.get('chauffeur'),
    statut: formData.get('statut') || 'en_attente',
  }

  if (clientId) {
    insertData.client_id = clientId
  } else if (nomClient) {
    insertData.notes_client = nomClient
  }

  const { error } = await supabase.from('taches').insert(insertData)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/taches')
  return { success: true }
}
