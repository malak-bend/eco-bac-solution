'use server'

import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase'

export type LoginState = { error: string } | undefined

export async function login(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !data.user) {
    return { error: 'Courriel ou mot de passe incorrect.' }
  }

  const role = data.user.app_metadata?.role

  if (role === 'chauffeur') {
    redirect('/chauffeur')
  }

  redirect('/dashboard')
}
