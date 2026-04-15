import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

function parseDevice(ua: string): 'mobile' | 'tablet' | 'desktop' | 'unknown' {
  if (!ua) return 'unknown'
  const u = ua.toLowerCase()
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobile))/i.test(u)) return 'tablet'
  if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop/i.test(u)) return 'mobile'
  return 'desktop'
}

function parseBrowser(ua: string): string {
  if (!ua) return 'Unknown'
  if (/edg\//i.test(ua))     return 'Edge'
  if (/opr\//i.test(ua))     return 'Opera'
  if (/chrome\//i.test(ua))  return 'Chrome'
  if (/firefox\//i.test(ua)) return 'Firefox'
  if (/safari\//i.test(ua))  return 'Safari'
  return 'Other'
}

function parseOS(ua: string): string {
  if (!ua) return 'Unknown'
  if (/windows/i.test(ua))     return 'Windows'
  if (/macintosh|mac os/i.test(ua)) return 'macOS'
  if (/android/i.test(ua))    return 'Android'
  if (/iphone|ipad|ipod/i.test(ua)) return 'iOS'
  if (/linux/i.test(ua))      return 'Linux'
  return 'Other'
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const page = (body.page as string) || '/'

    const userAgent = req.headers.get('user-agent') || ''
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown'

    const payload = await getPayloadClient()

    await payload.create({
      collection: 'site-visits',
      data: {
        page,
        ipAddress: ip,
        userAgent,
        browser: parseBrowser(userAgent),
        os: parseOS(userAgent),
        device: parseDevice(userAgent),
        referrer: req.headers.get('referer') || '',
      },
      overrideAccess: true,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Visit tracking error:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
