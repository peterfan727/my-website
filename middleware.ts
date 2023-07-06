import { NextResponse, NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    // get visitor geo on home page
    if (request.nextUrl.pathname == '/') {
        const { nextUrl: url, geo } = request
        const country = geo?.country || 'unknown country'
        url.searchParams.set('country', country)
        return NextResponse.rewrite(url)
    }
    return NextResponse.next()
}
 
// See "Matching Paths" below to learn more
// export const config = {
//   matcher: '/:path*',
// }