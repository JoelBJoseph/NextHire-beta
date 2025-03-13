import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req })
  const isAuthenticated = !!token

  // Get the pathname of the request
  const pathname = req.nextUrl.pathname

  // Paths that require authentication
  const authRoutes = ["/dashboard", "/profile", "/admin"]
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Paths that are only for non-authenticated users
  const publicRoutes = ["/login", "/register"]
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // Admin routes
  const adminRoutes = ["/admin"]
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))

  // Check if the user is trying to access a protected route without being authenticated
  if (isAuthRoute && !isAuthenticated) {
    const url = new URL(`/login`, req.url)
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  // Check if the user is trying to access a public route while being authenticated
  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Check if the user is trying to access an admin route without being an admin
  if (isAdminRoute && isAuthenticated && token.role !== "ADMIN" && token.role !== "ORGANIZATION") {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/admin/:path*", "/login", "/register"],
}

