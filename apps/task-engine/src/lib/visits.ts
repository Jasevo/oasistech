import { getPayloadClient } from './payload'

const PAGE_LABELS: Record<string, string> = {
  '/':           'Dashboard',
  '/tasks':      'Tasks',
  '/projects':   'Projects',
  '/users':      'Users',
  '/analytics':  'Analytics',
  '/activity':   'Activity',
  '/visitors':   'Visitors',
  '/settings':   'Settings',
}

export async function fetchRecentVisitActivity(limit = 20) {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'site-visits',
      sort: '-createdAt',
      limit,
      overrideAccess: true,
    })

    return result.docs.map((v: any) => {
      const page = (v.page as string) || '/'
      const label = PAGE_LABELS[page] || page
      const taskMatch = page.match(/^\/tasks\/(.+)$/)
      const projectMatch = page.match(/^\/projects\/(.+)$/)

      let action = `visited ${label}`
      if (taskMatch) action = 'viewed a task'
      if (projectMatch) action = 'viewed a project'

      return {
        id: v.id as string,
        actor: 'Admin',
        action,
        page,
        device: (v.device as string) || 'unknown',
        browser: (v.browser as string) || 'Unknown',
        timestamp: v.createdAt as string,
        type: 'visit' as const,
      }
    })
  } catch {
    return []
  }
}

export async function fetchVisits(limit = 50) {
  try {
    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: 'site-visits',
      sort: '-createdAt',
      limit,
      overrideAccess: true,
    })

    return result
  } catch (error) {
    console.error('Failed to fetch visits:', error)
    return { docs: [], totalDocs: 0, totalPages: 0, page: 1 }
  }
}

export async function fetchVisitStats() {
  try {
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
  } catch (error) {
    console.error('Failed to fetch visit stats:', error)
    return {
      total: 0,
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
      devices: { desktop: 0, mobile: 0, tablet: 0, unknown: 0 },
      topPages: [],
      topBrowsers: [],
    }
  }
}
