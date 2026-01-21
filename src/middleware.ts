import { type NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/pricing',
    '/auth/login',
    '/auth/signup',
    '/auth/forgot-password',
    '/auth/callback',
    '/guides',
    '/blog',
    '/invoice-maker',
    '/invoice-template',
    '/free-invoice-generator',
  ];

  // Check if current path is public
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  // If public route, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For protected routes, the client-side AuthContext will handle redirects
  // This middleware just allows the request to proceed to the client
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
