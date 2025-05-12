import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the auth token from cookies
  const token = request.cookies.get('auth_token')?.value;

  // Define which routes are considered auth routes (public routes)
  const isAuthRoute =
    request.nextUrl.pathname === '/' ||
    request.nextUrl.pathname === '/login' ||
    request.nextUrl.pathname === '/register';

  // If user is not authenticated and trying to access protected route
  if (!token && !isAuthRoute) {
    const loginUrl = new URL('/', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If user is authenticated and trying to access auth routes
  if (token && isAuthRoute) {
    const homeUrl = new URL('/home', request.url);
    return NextResponse.redirect(homeUrl);
  }

  // For API requests, add the Authorization header with the token
  if (token && request.nextUrl.pathname.startsWith('/api/')) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('Authorization', token);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
