import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(request: NextRequest) {
  // Skip middleware for static assets and non-admin routes
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    !request.nextUrl.pathname.startsWith("/admin") ||
    request.nextUrl.pathname.startsWith("/admin/login") ||
    request.nextUrl.pathname.startsWith("/admin/reset-password") ||
    request.nextUrl.pathname.startsWith("/setup")
  ) {
    return NextResponse.next()
  }

  // Create a response object
  const res = NextResponse.next()

  try {
    // Create a Supabase client configured to use cookies
    const supabase = createMiddlewareClient({ req: request, res })

    // First check if we have a session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !sessionData.session) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    // Get the user using getUser()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    // If there's an error or no user, redirect to login
    if (error || !user) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    // Check if the user is an admin
    const { data: adminUser, error: adminError } = await supabase
      .from("admin_users")
      .select("id")
      .eq("auth_id", user.id)
      .single()

    // If there's an error or no admin user, redirect to login
    if (adminError || !adminUser) {
      // Sign out the user
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    // User is authenticated and is an admin, allow access
    return res
  } catch (error) {
    console.error("Middleware error:", error)
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }
}

// Specify which routes this middleware should run on
export const config = {
  matcher: ["/admin/:path*"],
}
