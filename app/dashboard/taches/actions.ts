'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase'

export type TacheState = { error?: string; success?: boolean } | undefined

export async function creerTache(
  prevState: TacheState,
  formData: FormData
): Promise<TacheState> {
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.from('taches').insert({
    date_planifiee: formData.get('date'),
    client: formData.get('client'),
    adresse: formData.get('adresse'),
    type: formData.get('type'),
    conteneur: formData.get('conteneur'),
    chauffeur: formData.get('chauffeur'),
    statut: formData.get('statut') || 'en_attente',
  })

  if (error) return { error: error.message }

  revalidatePath('/dashboard/taches')
  return { success: true }
}
