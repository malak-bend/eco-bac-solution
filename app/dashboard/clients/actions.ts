'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase'

export type ClientState = { error?: string; success?: boolean } | undefined

export async function creerClient(
  prevState: ClientState,
  formData: FormData
): Promise<ClientState> {
  const supabase = await createSupabaseServerClient()

  const nom = (formData.get('nom') as string | null)?.trim()
  if (!nom) return { error: 'Le nom du client est requis.' }

  const { error } = await supabase.from('clients').insert({
    nom,
    email:       (formData.get('email') as string | null)?.trim()     || null,
    telephone:   (formData.get('telephone') as string | null)?.trim() || null,
    ville:       (formData.get('ville') as string | null)?.trim()     || null,
    type_client: (formData.get('type_client') as string | null)       || null,
  })

  if (error) return { error: error.message }

  revalidatePath('/dashboard/clients')
  return { success: true }
}
