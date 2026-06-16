# OasisTech — SharePoint Developer Technical Assessment

A production-ready enterprise platform consisting of two applications: a **Secure Task Engine** (Next.js + PayloadCMS) with a full-featured dashboard, and an **Executive Inbox** (SPFx Web Part) for Microsoft 365.

**Live Demo**: [oasistech.jasevo.com](https://oasistech.jasevo.com)

---

## Architecture Overview

```
OasisTech/
├── apps/
│   ├── task-engine/          # Next.js 15 + PayloadCMS 3 (Part 2 + Bonus)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (frontend)/   # Dashboard pages (9 pages + 2 detail views)
│   │   │   │   └── (payload)/    # Payload admin panel + REST API
│   │   │   ├── actions/          # Server actions (task + project CRUD)
│   │   │   ├── collections/      # Tasks, Projects, ApiUsers, SiteVisits
│   │   │   ├── components/       # UI components, charts, drawers, layout
│   │   │   ├── hooks/            # logActivity hook
│   │   │   ├── context/          # AI context, Language context
│   │   │   └── lib/              # Server-side data fetching (Local API)
│   │   ├── payload.config.ts
│   │   ├── Dockerfile
│   │   └── .env.example
│   │
│   └── executive-inbox/      # SPFx 1.22 Web Part (Part 1)
│       ├── src/webparts/executiveInbox/
│       │   ├── components/       # React 17 + Fluent UI v8
│       │   ├── services/         # Microsoft Graph service layer
│       │   └── models/           # TypeScript interfaces
│       └── config/               # SPFx config + Graph permissions
│
├── SECURITY_BRIEF.md         # Security architecture documentation
└── README.md
```

### Technology Stack

| Layer | Technology |
|---|---|
| Frontend Framework | Next.js 15 (App Router, React Server Components) |
| Backend / CMS | PayloadCMS 3.x (integrated as Next.js plugin) |
| Database | PostgreSQL (hosted on Dokploy) |
| Styling | Tailwind CSS 3 + Framer Motion 11 |
| Charts | Recharts 2 |
| Icons | Lucide React |
| Intelligent Assistant | Oasis AI — streaming chat + live insights |
| SPFx | SharePoint Framework 1.22, React 17, Fluent UI v8 |
| Deployment | Docker + Dokploy |

---

## Part 1: Executive Inbox (SPFx Web Part)

A SharePoint Framework web part that displays the authenticated user's display name and their 5 most recent Outlook emails using Microsoft Graph.

### Features
- Displays user profile via `MSGraphClientV3`
- Lists 5 recent emails with sender, subject, preview, and relative timestamps
- Read/unread visual indicators
- Fluent UI v8 components (Spinner, MessageBar, Persona, Icon)
- SharePoint theme-aware SCSS styling
- Error and empty state handling

### Graph Permissions
Declared in `config/package-solution.json`:
- `User.Read` — Read user profile
- `Mail.Read` — Read user's mailbox

### SPFx Structure
```
apps/executive-inbox/
├── src/webparts/executiveInbox/
│   ├── ExecutiveInboxWebPart.ts        # Web part entry, acquires Graph client
│   ├── services/GraphService.ts        # Encapsulated Graph API calls
│   ├── components/
│   │   ├── ExecutiveInbox.tsx           # Main component with loading/error states
│   │   ├── UserGreeting.tsx            # Persona + welcome message
│   │   ├── EmailList.tsx               # Email list container
│   │   └── EmailItem.tsx               # Individual email row
│   └── models/
│       ├── IEmail.ts                   # Email interface
│       └── IExecutiveInboxProps.ts     # Component props
```

> **Note**: This web part requires deployment to an M365 tenant for runtime testing. The code is structurally complete and follows SPFx 1.22 conventions.

---

## Part 2: Secure Task Engine

A full-stack task management system with PayloadCMS backend, REST API with API key authentication, and a server-rendered dashboard with full inline CRUD capabilities.

### Collections

| Collection | Fields | Purpose |
|---|---|---|
| **Tasks** | title, status (todo/in-progress/completed), priority (low/medium/high/urgent), description, dueDate, project (relation) | Core task data |
| **Projects** | name, description, status (active/archived), color (8 options) | Task grouping |
| **ApiUsers** | email, password, role (admin/api-consumer), displayName, API key | Authentication |
| **SiteVisits** | page, ipAddress, country, city, browser, os, device, referrer | Visitor analytics |

### Access Control
All collections enforce authentication on every operation:
```typescript
access: {
  create: ({ req: { user } }) => Boolean(user),
  read:   ({ req: { user } }) => Boolean(user),
  update: ({ req: { user } }) => Boolean(user),
  delete: ({ req: { user } }) => Boolean(user),
}
```
Unauthenticated requests receive `401 Unauthorized`.

### REST API Authentication
External consumers authenticate using the HTTP header:
```
Authorization: api-users API-Key <your-api-key>
```

### Server Actions (Dashboard Mutations)
Dashboard mutations use Next.js Server Actions backed by the Payload Local API — no HTTP round-trip, no API key exposed to the browser:

```
src/actions/
├── tasks.ts      # createTask, updateTask, updateTaskStatus, deleteTask
└── projects.ts   # createProject, updateProject, deleteProject
```

All actions call `revalidatePath()` after mutation so the relevant pages refresh automatically.

### Dashboard Data Fetching
Read operations use Payload's **Local API** (in-process function calls) with `overrideAccess: true`. This runs exclusively on the server — no API keys are sent to the browser, and no HTTP requests are made for dashboard rendering.

### Dashboard Pages

| Page | Route | Description |
|---|---|---|
| Dashboard | `/` | Greeting, stat cards, recent tasks, quick actions, AI widget |
| Tasks | `/tasks` | Task list with filters, search, sort, pagination + **New Task** button |
| Task Detail | `/tasks/[id]` | Hero header, progress tracker, metadata — **Edit** and **Delete** in-page |
| Projects | `/projects` | Project grid with task counts and completion bars + **New Project** button |
| Project Detail | `/projects/[id]` | Project info + task list — **Add Task**, **Delete Project** in-page |
| Users | `/users` | User list with role badges and API key status |
| Analytics | `/analytics` | Donut, bar, trend, and priority charts + completion ring |
| Activity | `/activity` | Vertical timeline of field-level changes (before/after diffs) |
| Visitors | `/visitors` | Visit counts, device breakdown, browser stats, recent visits table |
| Settings | `/settings` | App info, API endpoints, dark mode toggle |

### Inline Task & Project Actions

Users can perform all CRUD operations from the dashboard without accessing the admin panel:

| Action | Where | How |
|---|---|---|
| Create task | Tasks page header, Quick Actions, Project detail | Slide-in drawer with all fields |
| Edit task | Task detail page | Slide-in drawer pre-populated |
| Change task status | Any task card | Click status icon to cycle: To Do → In Progress → Completed |
| Delete task | Task detail page | Confirm dialog → redirects to /tasks |
| Create project | Projects page header, Quick Actions | Slide-in drawer with live color preview |
| Delete project | Project detail page | Confirm dialog → redirects to /projects |
| Add task to project | Project detail — Tasks section | Drawer pre-set to current project |

### Drawer Components
```
src/components/drawers/
├── CreateTaskDrawer.tsx      # Slide-in: title, description, status, priority, due date, project
├── EditTaskDrawer.tsx        # Same fields pre-populated, status as button group
├── CreateProjectDrawer.tsx   # Name, description, 8-color picker, live gradient preview
└── DeleteConfirmDialog.tsx   # Animated confirm modal with cancel/confirm
```

### Audit Trail
Every task and project change is logged to the `ActivityLogs` collection with field-level before/after values. Visible on the `/activity` page as a timestamped, grouped timeline.

### UI Features
- Collapsible sidebar with gold active indicator
- Mobile bottom tab navigation (< 768px)
- URL-synced filters (bookmarkable/shareable)
- Slide-in drawer animations (Framer Motion spring)
- Optimistic status toggle on task cards (instant UI + revert on error)
- Staggered Framer Motion animations on cards and charts
- Skeleton loading states
- Dark mode toggle (localStorage persistence)
- Click-to-copy API endpoint blocks
- Overdue task badges with day count
- Responsive grid layouts (mobile/tablet/desktop)
- Arabic / English language toggle (RTL-aware layout)
- Oasis AI assistant drawer (streaming chat + rotating insights)

---

## Part 3: Bonus

- **Modern UI/UX**: Custom color palette (#092421 primary, #e3ba54 gold accent), Tailwind CSS, Framer Motion page transitions and card animations
- **Oasis AI**: Embedded intelligent assistant with streaming chat and live platform data context
- **Real Visitor Analytics**: IP-based visit tracking with device/browser detection, geographic data
- **Full Activity Audit Trail**: Field-level change tracking on all mutations
- **Deployment-Ready**: Multi-stage Dockerfile, environment variable configuration, Dokploy hosting
- **Security Brief**: Comprehensive documentation of the authentication architecture (see `SECURITY_BRIEF.md`)

---

## Prerequisites

- **Node.js** 18.x or 20.x
- **npm** 9+
- **PostgreSQL** 15+ (local or hosted)

---

## Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Jasevo/oasistech.git
cd OasisTech
```

### 2. Set Up the Task Engine
```bash
cd apps/task-engine
cp .env.example .env
```

Edit `.env` with your values:
```env
# PostgreSQL connection string
DATABASE_URI=postgresql://user:password@localhost:5432/task_engine

# Payload encryption key (min 32 chars, generate a random string)
PAYLOAD_SECRET=your-random-secret-at-least-32-characters-long

# Display name shown in dashboard greeting
DASHBOARD_USER_NAME=Admin

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: pre-generated API key (or create via admin panel)
TASK_ENGINE_API_KEY=

# Oasis AI service key (optional — Oasis AI features degrade gracefully without it)
GROQ_API_KEY=
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start the Development Server
```bash
npm run dev
```

The app will be available at:
- **Dashboard**: http://localhost:3000
- **Payload Admin**: http://localhost:3000/admin
- **REST API**: http://localhost:3000/api/tasks

### 5. Create Your First Admin User
1. Visit http://localhost:3000/admin
2. Payload will prompt you to create an admin user on first launch
3. Fill in email, password, role, and display name

### 6. Create an API User with API Key
1. In the admin panel, go to **Api Users** collection
2. Create a new user with role "api-consumer"
3. Enable the API Key toggle — Payload generates a unique key
4. Copy the API key for REST API usage

### 7. Seed Sample Data
Use the built-in seed script to populate sample projects and tasks:
```bash
npm run seed
```
Or manually:
1. In the admin panel, create 2–3 **Projects** (e.g., "Website Redesign", "API Integration")
2. Create tasks via the dashboard **New Task** button or admin panel
3. Visit the dashboard to see stats, charts, and activity populated

---

## Testing the REST API

```bash
# Without auth — returns 401
curl http://localhost:3000/api/tasks

# With valid API key — returns task data
curl -H "Authorization: api-users API-Key YOUR_API_KEY" http://localhost:3000/api/tasks

# Create a task via API
curl -X POST http://localhost:3000/api/tasks \
  -H "Authorization: api-users API-Key YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"title": "New Task", "status": "todo", "priority": "medium"}'
```

---

## SPFx Development

The Executive Inbox web part requires an M365 tenant for runtime testing. To verify TypeScript compilation:

```bash
cd apps/executive-inbox
npm install
npx tsc --noEmit
```

To deploy to SharePoint:
1. Build the `.sppkg` package using `gulp bundle --ship && gulp package-solution --ship`
2. Upload to the SharePoint App Catalog
3. A tenant admin must approve the Graph permissions (`User.Read`, `Mail.Read`)
4. Add the web part to a SharePoint page

---

## Deployment (Dokploy)

The Task Engine is deployed on Dokploy at `oasistech.jasevo.com`.

### Docker Build
```bash
cd apps/task-engine
docker build -t oasistech-task-engine .
```

### Environment Variables on Dokploy
Configure these in Dokploy's environment settings (never in the Docker image):

| Variable | Description |
|---|---|
| `DATABASE_URI` | PostgreSQL connection string |
| `PAYLOAD_SECRET` | Encryption key (min 32 chars) |
| `DASHBOARD_USER_NAME` | Greeting display name |
| `NEXT_PUBLIC_APP_URL` | Production URL (`https://oasistech.jasevo.com`) |
| `TASK_ENGINE_API_KEY` | Optional pre-set API key |
| `GROQ_API_KEY` | Oasis AI service key |

### Production Checklist
- [ ] `PAYLOAD_SECRET` is a cryptographically random 32+ character string
- [ ] `DATABASE_URI` uses SSL (`?sslmode=require`)
- [ ] HTTPS is enforced on the domain
- [ ] `.env` is not committed to source control
- [ ] Admin user created with a strong password

---

## Security

See [SECURITY_BRIEF.md](SECURITY_BRIEF.md) for the full security architecture, covering:
- PayloadCMS API key authentication and encrypted storage
- Access control model (private by default)
- Server-side secret isolation (Local API, no `NEXT_PUBLIC_` prefix)
- REST API authentication enforcement
- SPFx Graph permission model (least privilege)
- Deployment security practices

---

## Project Structure Reference

```
apps/task-engine/src/
├── actions/
│   ├── tasks.ts                # createTask, updateTask, updateTaskStatus, deleteTask
│   └── projects.ts             # createProject, updateProject, deleteProject
├── app/
│   ├── (frontend)/
│   │   ├── layout.tsx              # Shell layout (sidebar + topbar)
│   │   ├── page.tsx                # Dashboard overview
│   │   ├── tasks/
│   │   │   ├── page.tsx            # Task list with filters + New Task button
│   │   │   └── [id]/page.tsx       # Task detail — edit + delete in-page
│   │   ├── projects/
│   │   │   ├── page.tsx            # Project grid + New Project button
│   │   │   └── [id]/page.tsx       # Project detail — add task + delete in-page
│   │   ├── users/page.tsx          # Users list
│   │   ├── analytics/page.tsx      # Charts dashboard
│   │   ├── activity/page.tsx       # Activity timeline
│   │   ├── visitors/page.tsx       # Visitor analytics
│   │   └── settings/page.tsx       # App settings
│   ├── api/
│   │   ├── activity/route.ts       # Combined activity feed
│   │   ├── oasis-ai/route.ts       # Oasis AI streaming endpoint
│   │   ├── search/route.ts         # Global task + project search
│   │   └── visit/route.ts          # Visit tracking
│   ├── (payload)/
│   │   ├── admin/[[...segments]]/  # Payload admin panel
│   │   └── api/[...slug]/          # REST API routes
│   ├── layout.tsx                  # Root layout
│   └── globals.css
├── collections/
│   ├── Tasks.ts
│   ├── Projects.ts
│   ├── ApiUsers.ts
│   └── SiteVisits.ts
├── components/
│   ├── drawers/                    # CreateTaskDrawer, EditTaskDrawer, CreateProjectDrawer, DeleteConfirmDialog
│   ├── layout/                     # Shell, Sidebar, TopBar, BottomNav
│   ├── ui/                         # StatusBadge, PriorityBadge, Skeleton, EmptyState, etc.
│   ├── charts/                     # StatusDonut, ProjectBar, TrendLine, CompletionRing
│   ├── ai/                         # OasisAIDrawer, DashboardAIWidget, AIInputHelper (Oasis AI)
│   ├── TaskCard.tsx, TaskList.tsx, TaskFilters.tsx, TasksPageHeader.tsx
│   ├── TaskDetailView.tsx
│   ├── ProjectCard.tsx, ProjectFilters.tsx, ProjectsPageHeader.tsx
│   ├── ProjectDetailView.tsx
│   ├── UserRow.tsx, UserFilters.tsx
│   ├── AnalyticsDashboard.tsx
│   ├── ActivityTimeline.tsx
│   ├── VisitorsDashboard.tsx
│   ├── SettingsPanel.tsx
│   ├── StatsCards.tsx
│   └── Greeting.tsx
├── context/
│   ├── AIContext.tsx               # AI drawer open/close state
│   └── LanguageContext.tsx         # EN/AR toggle + t() helper
├── hooks/
│   └── logActivity.ts              # Payload afterChange/afterDelete hooks
└── lib/
    ├── payload.ts                  # getPayload singleton
    ├── tasks.ts                    # Task queries (Local API)
    ├── projects.ts                 # Project queries
    ├── users.ts                    # User queries
    ├── analytics.ts                # Analytics aggregation
    └── visits.ts                   # Visit stats queries
```
