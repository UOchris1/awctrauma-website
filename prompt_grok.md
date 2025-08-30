Create utility functions for Supabase clients:

Create a folder like src/utils/supabase/ (or adjust to match your structure, e.g., lib/supabase/ if that's what you use).
In src/utils/supabase/browser.ts (for client-side components):
typescriptimport { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

In src/utils/supabase/server.ts (for server-side code, like pages or actions; this handles cookies for sessions):
typescriptimport { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
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
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Ignore if called from a Server Component
          }
        },
      },
    }
  )
}

In src/utils/supabase/middleware.ts (for session refresh in middleware):
typescriptimport { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refreshing the auth token
  await supabase.auth.getUser()

  return supabaseResponse
}



Set up middleware to handle session updates (create middleware.ts at the project root or in src/):
typescriptimport { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

Update your code to use the new clients:

Replace imports like import { createClient } from '@supabase/auth-helpers-nextjs' with the new utilities.
For server-side (e.g., in your app/viewer/[id]/page.tsx or other server components):
typescriptimport { createClient } from '@/utils/supabase/server'  // Adjust path if needed

// In getFile:
const supabase = await createClient()
// Then use supabase.from(...) as before

For client-side components (if any):
typescriptimport { createClient } from '@/utils/supabase/browser'

const supabase = createClient()

If you have auth routes (e.g., login, confirm), update them similarly. For example, add a confirmation handler if needed (see Supabase docs for full auth flow).


Handle auth confirmation (if using email auth):

In your Supabase dashboard > Authentication > Templates, update the "Confirm signup" template to point to /auth/confirm?token_hash={{ .TokenHash }}&type=email.
Create app/auth/confirm/route.ts:
typescriptimport { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  if (token_hash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      redirect(next)
    }
  }
  redirect('/error')
}




After making these changes, test locally with npm run dev, commit/push to your main branch, and redeploy on Vercel. If you run into errors (e.g., during auth or queries), share the specific error log or the contents of your current supabase lib file for more targeted fixes.
For the telemetry notice: It's standard and anonymous; if you want to opt out, run npx next telemetry disable locally or add it to your scripts.
If your build completed successfully after this log snippet (check Vercel dashboard for the full output), your site should be live—test it! If not, paste the full build error.