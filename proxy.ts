import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

type Role = 'admin' | 'adjointe' | 'chauffeur'

// Routes accessibles sans authentification
const PUBLIC_ROUTES = ['/login']

// Préfixes de routes restreints par rôle
// Clé = préfixe de chemin, valeur = rôles autorisés
const ROLE_ROUTES: Record<string, Role[]> = {
  '/admin': ['admin'],
  '/chauffeur': ['admin', 'chauffeur'],
}

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request })

  // Création du client Supabase avec lecture/écriture des cookies sur la requête
  // et la réponse pour permettre le rafraîchissement automatique de session.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // getUser() valide le JWT auprès de Supabase Auth — ne pas utiliser getSession()
  // qui ne vérifie pas la validité côté serveur.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Redirection vers /login si l'utilisateur n'est pas authentifié
  if (!user && !PUBLIC_ROUTES.includes(path)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirection vers /dashboard si l'utilisateur est déjà connecté
  if (user && path === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Vérification des rôles pour les routes restreintes
  if (user) {
    const role = user.app_metadata?.role as Role | undefined

    for (const [prefix, allowedRoles] of Object.entries(ROLE_ROUTES)) {
      if (path.startsWith(prefix) && (!role || !allowedRoles.includes(role))) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon\\.ico).*)'],
}
