import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { fetchTaskStats } from '@/lib/tasks'
import { fetchVisitStats } from '@/lib/visits'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { messages, context, type } = await req.json()

    // Fetch live site data to enrich the AI's awareness
    const [taskStats, visitStats] = await Promise.all([
      fetchTaskStats(),
      fetchVisitStats(),
    ])

    const now = new Date()
    const timeString = now.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

    const systemPrompt = `You are Oasis AI — the intelligent executive assistant built into OasisTech, a premium enterprise task management platform used by high-end corporate offices.

CURRENT DATE & TIME: ${timeString}

LIVE PLATFORM DATA:
• Tasks: ${taskStats.total} total — ${taskStats.todo} to-do, ${taskStats.inProgress} in progress, ${taskStats.completed} completed
• Completion rate: ${taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0}%
• Site visitors: ${visitStats.total} total — ${visitStats.today} today, ${visitStats.thisWeek} this week, ${visitStats.thisMonth} this month
• Top visited pages: ${visitStats.topPages.slice(0, 3).map((p: { page: string; count: number }) => p.page).join(', ') || 'none yet'}
• Device split: ${visitStats.devices.desktop} desktop, ${visitStats.devices.mobile} mobile, ${visitStats.devices.tablet} tablet
• Top browsers: ${visitStats.topBrowsers.slice(0, 3).map((b: { browser: string; count: number }) => b.browser).join(', ') || 'none yet'}

PLATFORM: OasisTech — Next.js 15 + PayloadCMS 3 + PostgreSQL. Deployed at oasistech.jasevo.com.
PAGES AVAILABLE: Dashboard (/), Tasks (/tasks), Projects (/projects), Users (/users), Analytics (/analytics), Activity (/activity), Visitors (/visitors), Settings (/settings), Admin Panel (/admin).

CURRENT PAGE CONTEXT: ${context || 'Dashboard'}
REQUEST TYPE: ${type || 'chat'}

BEHAVIOUR:
- Speak with executive-level precision and professionalism. No fluff.
- When referencing live data, use the numbers above — they are current.
- For field suggestions, generate polished, enterprise-grade text that fits the context.
- Format with clean prose. Use bullet points only when listing 3+ distinct items.
- Keep responses under 180 words unless more detail is explicitly requested.
- When suggesting navigation, mention the exact path (e.g., go to /tasks or /analytics).
- You represent OasisTech's brand: professional, intelligent, confident.`

    // For insight generation, use a shorter model
    const model =
      type === 'insight'
        ? 'llama-3.1-8b-instant'
        : 'llama-3.3-70b-versatile'

    const stream = await groq.chat.completions.create({
      model,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      stream: true,
      max_tokens: type === 'insight' ? 80 : 512,
      temperature: type === 'insight' ? 0.8 : 0.65,
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || ''
            if (text) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text })}\n\n`),
              )
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (err) {
          controller.error(err)
        }
      },
    })

    return new NextResponse(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Oasis AI error:', error)
    return NextResponse.json({ error: 'AI service unavailable' }, { status: 500 })
  }
}
