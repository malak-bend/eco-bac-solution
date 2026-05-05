import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Client Components — singleton par onglet/session navigateur
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Server Components, Route Handlers, Server Actions — nouvelle instance par requête
export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Components ne peuvent pas écrire de cookies ;
            // le proxy gère le rafraîchissement de session.
          }
        },
      },
    }
  )
}
