import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
 
export function middleware(request) {
    const token = request.cookies.get('accessToken')
    // console.log(token);
    if (token) {
        const decodedToken = jwt.decode(token.value);
        if (decodedToken) {
            const expirationTimestamp = decodedToken.exp; 
            const currentTimestamp = Math.floor(Date.now() / 1000);
            if (currentTimestamp < expirationTimestamp) {
                return NextResponse.next();
            } else {
                return NextResponse.redirect(new URL('/login', request.url));
            }
        } else {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    } else {
        // console.log("next done", request.url);
        return NextResponse.redirect(new URL(`/login`, request.url));
    }
}

export const config = {
    matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - api (API routes)
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico (favicon file)
       */
      '/((?!login|_next/static|_next/image|favicon.ico).*)',
      '/dashboard/:path*'
    ],
  }