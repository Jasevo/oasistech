import { getPayloadClient } from './payload'

export async function fetchVisits(limit = 50) {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'site-visits',
    sort: '-createdAt',
    limit,
    overrideAccess: true,
  })

  return result
}

export async function fetchVisitStats() {
  const payload = await getPayloadClient()

  const allVisits = await payload.find({
    collection: 'site-visits',
    limit: 0,
    overrideAccess: true,
  })

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const last7Days = new Date()
  last7Days.setDate(last7Days.getDate() - 7)
  last7Days.setHours(0, 0, 0, 0)

  const last30Days = new Date()
  last30Days.setDate(last30Days.getDate() - 30)
  last30Days.setHours(0, 0, 0, 0)

  const recentVisits = await payload.find({
    collection: 'site-visits',
    limit: 10000,
    overrideAccess: true,
    where: {
      createdAt: {
        greater_than: last30Days.toISOString(),
      },
    },
  })

  const visits = recentVisits.docs
  const todayCount = visits.filter(
    (v) => new Date(v.createdAt) >= today,
  ).length
  const weekCount = visits.filter(
    (v) => new Date(v.createdAt) >= last7Days,
  ).length
  const monthCount = visits.length

  // Device breakdown
  const devices = { desktop: 0, mobile: 0, tablet: 0, unknown: 0 }
  visits.forEach((v) => {
    const d = (v.device as keyof typeof devices) || 'unknown'
    devices[d] = (devices[d] || 0) + 1
  })

  // Top pages
  const pageCounts: Record<string, number> = {}
  visits.forEach((v) => {
    const page = (v.page as string) || '/'
    pageCounts[page] = (pageCounts[page] || 0) + 1
  })
  const topPages = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([page, count]) => ({ page, count }))

  // Browser breakdown
  const browserCounts: Record<string, number> = {}
  visits.forEach((v) => {
    const browser = (v.browser as string) || 'Unknown'
    browserCounts[browser] = (browserCounts[browser] || 0) + 1
  })
  const topBrowsers = Object.entries(browserCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([browser, count]) => ({ browser, count }))

  return {
    total: allVisits.totalDocs,
    today: todayCount,
    thisWeek: weekCount,
    thisMonth: monthCount,
    devices,
    topPages,
    topBrowsers,
  }
}
