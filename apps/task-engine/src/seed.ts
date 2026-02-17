import { getPayload } from 'payload'
import config from '@payload-config'

async function seed() {
  const payload = await getPayload({ config })

  console.log('Seeding projects...')

  const websiteRedesign = await payload.create({
    collection: 'projects',
    data: {
      name: 'Website Redesign',
      description: 'Complete overhaul of the company website with modern design and improved UX',
      status: 'active',
      color: 'blue',
    },
  })

  const mobileApp = await payload.create({
    collection: 'projects',
    data: {
      name: 'Mobile App Launch',
      description: 'Native mobile application for iOS and Android platforms',
      status: 'active',
      color: 'purple',
    },
  })

  const marketing = await payload.create({
    collection: 'projects',
    data: {
      name: 'Q1 Marketing Campaign',
      description: 'Multi-channel marketing campaign for Q1 product launch',
      status: 'active',
      color: 'orange',
    },
  })

  const infrastructure = await payload.create({
    collection: 'projects',
    data: {
      name: 'Infrastructure Upgrade',
      description: 'Server migration and CI/CD pipeline improvements',
      status: 'active',
      color: 'teal',
    },
  })

  console.log('Projects created. Seeding tasks...')

  const tasks = [
    // Website Redesign tasks
    { title: 'Design new homepage layout', description: 'Create wireframes and high-fidelity mockups for the homepage with hero section, features grid, and testimonials', status: 'completed' as const, priority: 'high' as const, project: websiteRedesign.id, dueDate: '2026-02-10' },
    { title: 'Implement responsive navigation', description: 'Build mobile-first navigation with hamburger menu, dropdown submenus, and smooth transitions', status: 'completed' as const, priority: 'high' as const, project: websiteRedesign.id, dueDate: '2026-02-12' },
    { title: 'Set up design system tokens', description: 'Define color palette, typography scale, spacing, and component tokens in Tailwind config', status: 'completed' as const, priority: 'medium' as const, project: websiteRedesign.id, dueDate: '2026-02-08' },
    { title: 'Build contact form with validation', description: 'Create contact page with form validation, reCAPTCHA integration, and email notification', status: 'in-progress' as const, priority: 'medium' as const, project: websiteRedesign.id, dueDate: '2026-02-25' },
    { title: 'Optimize images and assets', description: 'Compress all images, convert to WebP format, and implement lazy loading', status: 'in-progress' as const, priority: 'low' as const, project: websiteRedesign.id, dueDate: '2026-03-01' },
    { title: 'SEO audit and meta tags', description: 'Review all pages for SEO best practices, add meta descriptions, Open Graph tags, and structured data', status: 'todo' as const, priority: 'medium' as const, project: websiteRedesign.id, dueDate: '2026-03-05' },
    { title: 'Cross-browser testing', description: 'Test on Chrome, Firefox, Safari, and Edge. Fix any layout or functionality issues', status: 'todo' as const, priority: 'high' as const, project: websiteRedesign.id, dueDate: '2026-03-10' },

    // Mobile App tasks
    { title: 'Set up React Native project', description: 'Initialize project with Expo, configure TypeScript, ESLint, and folder structure', status: 'completed' as const, priority: 'high' as const, project: mobileApp.id, dueDate: '2026-02-05' },
    { title: 'Design authentication flow', description: 'Create login, registration, password reset, and biometric authentication screens', status: 'completed' as const, priority: 'urgent' as const, project: mobileApp.id, dueDate: '2026-02-14' },
    { title: 'Build task list screen', description: 'Implement scrollable task list with pull-to-refresh, search, filters, and swipe actions', status: 'in-progress' as const, priority: 'high' as const, project: mobileApp.id, dueDate: '2026-02-28' },
    { title: 'Implement push notifications', description: 'Set up Firebase Cloud Messaging for task reminders and due date alerts', status: 'todo' as const, priority: 'medium' as const, project: mobileApp.id, dueDate: '2026-03-08' },
    { title: 'Add offline mode support', description: 'Implement local SQLite storage with sync queue for offline task management', status: 'todo' as const, priority: 'high' as const, project: mobileApp.id, dueDate: '2026-03-15' },
    { title: 'App Store submission prep', description: 'Prepare screenshots, descriptions, privacy policy, and build signed release bundles', status: 'todo' as const, priority: 'urgent' as const, project: mobileApp.id, dueDate: '2026-03-20' },

    // Marketing Campaign tasks
    { title: 'Draft campaign brief', description: 'Define target audience, key messages, channels, budget allocation, and success metrics', status: 'completed' as const, priority: 'urgent' as const, project: marketing.id, dueDate: '2026-02-03' },
    { title: 'Create social media content calendar', description: 'Plan 30 days of posts across LinkedIn, Twitter, and Instagram with copy and visuals', status: 'completed' as const, priority: 'high' as const, project: marketing.id, dueDate: '2026-02-10' },
    { title: 'Design email newsletter template', description: 'Build responsive HTML email template with brand styling for product announcements', status: 'in-progress' as const, priority: 'medium' as const, project: marketing.id, dueDate: '2026-02-22' },
    { title: 'Set up analytics tracking', description: 'Configure UTM parameters, conversion goals, and dashboards in Google Analytics', status: 'in-progress' as const, priority: 'high' as const, project: marketing.id, dueDate: '2026-02-26' },
    { title: 'Write blog post series', description: 'Draft 4 blog posts covering product features, use cases, and customer success stories', status: 'todo' as const, priority: 'medium' as const, project: marketing.id, dueDate: '2026-03-05' },
    { title: 'Launch paid ad campaigns', description: 'Set up Google Ads and LinkedIn Ads with A/B testing for headlines and landing pages', status: 'todo' as const, priority: 'high' as const, project: marketing.id, dueDate: '2026-03-12' },

    // Infrastructure tasks
    { title: 'Migrate database to managed instance', description: 'Move PostgreSQL from self-hosted to managed cloud provider with zero-downtime migration', status: 'completed' as const, priority: 'urgent' as const, project: infrastructure.id, dueDate: '2026-02-07' },
    { title: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions with automated testing, linting, build, and deployment stages', status: 'completed' as const, priority: 'high' as const, project: infrastructure.id, dueDate: '2026-02-12' },
    { title: 'Implement monitoring and alerting', description: 'Set up application monitoring with error tracking, uptime checks, and Slack alerts', status: 'in-progress' as const, priority: 'high' as const, project: infrastructure.id, dueDate: '2026-02-24' },
    { title: 'Configure auto-scaling', description: 'Set up horizontal pod autoscaling based on CPU and memory thresholds', status: 'todo' as const, priority: 'medium' as const, project: infrastructure.id, dueDate: '2026-03-03' },
    { title: 'Security audit and hardening', description: 'Run vulnerability scans, update dependencies, enforce HTTPS, and review access controls', status: 'todo' as const, priority: 'urgent' as const, project: infrastructure.id, dueDate: '2026-03-10' },
  ]

  for (const task of tasks) {
    await payload.create({
      collection: 'tasks',
      data: task,
    })
    console.log(`  Created: ${task.title}`)
  }

  console.log(`\nDone! Created 4 projects and ${tasks.length} tasks.`)
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
