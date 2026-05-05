'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase'

export type ActionResult = { error?: string; success?: boolean } | undefined

export async function mettreAJourStatut(
  tacheId: string,
  nouveauStatut: string,
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient()

  const updates: Record<string, unknown> = { statut: nouveauStatut }

  // Upload photo if provided
  const photo = formData.get('photo') as File | null
  if (photo && photo.size > 0) {
    const ext = photo.name.split('.').pop() ?? 'jpg'
    const path = `${tacheId}/${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('taches-photos') // bucket à créer dans Supabase Storage
      .upload(path, photo, { contentType: photo.type })

    if (uploadError) {
      return { error: `Erreur photo : ${uploadError.message}` }
    }

    const { data: { publicUrl } } = supabase.storage
      .from('taches-photos')
      .getPublicUrl(path)

    updates.photo_url = publicUrl
  }

  // Save obstacle note
  const note = formData.get('note') as string | null
  if (note?.trim()) updates.note_obstacle = note.trim()

  const { error } = await supabase
    .from('taches')
    .update(updates)
    .eq('id', tacheId)

  if (error) return { error: error.message }

  revalidatePath('/chauffeur')
  return { success: true }
}
