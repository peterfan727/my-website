import { NextResponse, NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    // get visitor geo on home page
    if (request.nextUrl.pathname == '/') {
        const { nextUrl, geo } = request
        const country = geo?.country || 'unknown country'
        const headers = new Headers()
        headers.set('X-Geo-Country', country)
        return NextResponse.next({headers})
    }
    return NextResponse.next()
}
 
// See "Matching Paths" below to learn more
// export const config = {
//   matcher: '/:path*',
// }