import { NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/login']

export function middleware(request) {
    const { pathname } = request.nextUrl
    const token = request.cookies.get('token')?.value
    const userData = request.cookies.get('userData')?.value

    const isPublic = PUBLIC_PATHS.some(path => pathname === path || pathname.startsWith(path + '/'))

    // ถ้ามี token อยู่แล้ว ไม่ต้องเข้าหน้า login → ไป dashboard
    if (isPublic && token && userData) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // ถ้าไม่ใช่ public route และไม่มี token → บังคับไป login
    if (!isPublic && (!token || !userData)) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
