import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Temporarily disabled - using client-side auth protection instead
// This middleware was blocking Firebase Auth redirects
export async function middleware(request: NextRequest) {
    // Allow all routes - Firebase Auth handles protection client-side
    return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}

