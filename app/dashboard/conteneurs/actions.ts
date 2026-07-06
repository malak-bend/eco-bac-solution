'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase'

export type ConteneurState = { error?: string; success?: boolean } | undefined

export async function creerConteneur(
  prevState: ConteneurState,
  formData: FormData
): Promise<ConteneurState> {
  const supabase = await createSupabaseServerClient()

  const numero_serie = (formData.get('numero_serie') as string | null)?.trim()
  if (!numero_serie) return { error: 'Le numéro de série est requis.' }

  const taille = (formData.get('taille') as string | null)?.trim()
  if (!taille) return { error: 'La taille est requise.' }

  const { error } = await supabase.from('conteneurs').insert({
    numero_serie,
    taille,
    statut:               (formData.get('statut') as string | null)               || 'disponible',
    localisation_actuelle:(formData.get('localisation_actuelle') as string | null)?.trim() || null,
  })

  if (error) return { error: error.message }

  revalidatePath('/dashboard/conteneurs')
  return { success: true }
}
