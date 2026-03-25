import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function parseUserAgent(ua: string) {
  let browser = 'Unknown'
  let os = 'Unknown'
  let device: 'desktop' | 'mobile' | 'tablet' | 'unknown' = 'unknown'

  // Browser detection
  if (ua.includes('Firefox/')) browser = 'Firefox'
  else if (ua.includes('Edg/')) browser = 'Edge'
  else if (ua.includes('Chrome/')) browser = 'Chrome'
  else if (ua.includes('Safari/') && !ua.includes('Chrome')) browser = 'Safari'
  else if (ua.includes('Opera') || ua.includes('OPR/')) browser = 'Opera'

  // OS detection
  if (ua.includes('Windows')) os = 'Windows'
  else if (ua.includes('Mac OS')) os = 'macOS'
  else if (ua.includes('Linux')) os = 'Linux'
  else if (ua.includes('Android')) os = 'Android'
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS'

  // Device detection
  if (ua.includes('Mobile') || ua.includes('Android') && !ua.includes('Tablet')) {
    device = 'mobile'
  } else if (ua.includes('iPad') || ua.includes('Tablet')) {
    device = 'tablet'
  } else if (ua.includes('Windows') || ua.includes('Mac OS') || ua.includes('Linux')) {
    device = 'desktop'
  }

  return { browser, os, device }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only track page visits, skip static assets, API routes, admin, and Next.js internals
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|woff|woff2|ttf|map)$/)
  ) {
    return NextResponse.next()
  }

  const response = NextResponse.next()

  // Fire and forget — don't block the response
  try {
    const ua = request.headers.get('user-agent') || ''
    const { browser, os, device } = parseUserAgent(ua)
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'
    const referrer = request.headers.get('referer') || ''

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Use the REST API to create the visit record
    fetch(`${appUrl}/api/site-visits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: pathname,
        ipAddress: ip,
        browser,
        os,
        device,
        referrer,
        userAgent: ua,
      }),
    }).catch(() => {
      // Silently fail — visitor tracking should never break the site
    })
  } catch {
    // Silently fail
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}
