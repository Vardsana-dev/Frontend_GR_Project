import { NextResponse } from 'next/server'

export function middleware(request) {
    // Get auth token from cookies only
    const token = request.cookies.get('token')?.value
    const userData = request.cookies.get('userData')?.value
    
    // Check if user is on login page
    const isLoginPage = request.nextUrl.pathname === '/login'
    
    // If user is on login page and has valid token, redirect to dashboard
    if (isLoginPage && token && userData) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    
    // If user doesn't have token and trying to access any page other than login, redirect to login
    if (!token && !isLoginPage) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
    
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
