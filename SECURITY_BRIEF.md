# Security Brief: OasisTech Secure Task Engine

## 1. Authentication Architecture

### PayloadCMS API Key Strategy
The Task Engine uses PayloadCMS's built-in API Key authentication. The `api-users` collection has `auth.useAPIKey: true` enabled, which provides:

- **Encrypted storage**: API keys are encrypted at rest in PostgreSQL using the `PAYLOAD_SECRET` environment variable as the encryption key.
- **Header-based auth**: External consumers authenticate via the HTTP header:
  ```
  Authorization: api-users API-Key <your-api-key>
  ```
- **Per-user keys**: Each API user has a unique key that can be enabled/disabled independently through the admin panel.

### Access Control Model
Every collection (Tasks, Projects, ApiUsers) uses identical access control functions:

```typescript
access: {
  create: ({ req: { user } }) => Boolean(user),
  read: ({ req: { user } }) => Boolean(user),
  update: ({ req: { user } }) => Boolean(user),
  delete: ({ req: { user } }) => Boolean(user),
}
```

When a request arrives without authentication (no API key, no session cookie), `req.user` is `undefined`, the function returns `false`, and Payload returns a `401 Unauthorized` response. This makes all collections **private by default**.

## 2. Server-Side Secret Isolation

### How the API Key Stays Server-Side
The Next.js dashboard fetches data using Payload's **Local API** — direct in-process function calls that never leave the server:

```typescript
const payload = await getPayload({ config })
const tasks = await payload.find({
  collection: 'tasks',
  overrideAccess: true,  // Safe: only runs on server
})
```

**Why this is secure:**
- `overrideAccess: true` only executes in server components / server-side code.
- The code is never included in the client-side JavaScript bundle.
- No HTTP requests are made — data fetching is an in-process function call.
- No API key is needed for dashboard rendering.

### Environment Variable Security
- The `TASK_ENGINE_API_KEY` env var has **no** `NEXT_PUBLIC_` prefix.
- Next.js only exposes variables prefixed with `NEXT_PUBLIC_` to the browser bundle.
- Server-side environment variables (`PAYLOAD_SECRET`, `DATABASE_URI`, `TASK_ENGINE_API_KEY`) are inaccessible from client-side code.

## 3. REST API Security

The REST API at `/api/tasks` enforces authentication:

| Request | Result |
|---------|--------|
| `GET /api/tasks` (no auth header) | `401 Unauthorized` |
| `GET /api/tasks` (invalid API key) | `401 Unauthorized` |
| `GET /api/tasks` (valid API key) | `200 OK` with task data |

## 4. Database Security

- PostgreSQL connection string stored in `DATABASE_URI` env var (never in source code).
- Payload encrypts API keys before storing them in the database.
- The `.env` file is excluded from version control via `.gitignore`.

## 5. SPFx Permission Model

The Executive Inbox web part declares required Microsoft Graph permissions in `package-solution.json`:

```json
"webApiPermissionRequests": [
  { "resource": "Microsoft Graph", "scope": "User.Read" },
  { "resource": "Microsoft Graph", "scope": "Mail.Read" }
]
```

- Permissions must be approved by a SharePoint tenant administrator.
- The web part never handles raw OAuth tokens — `MSGraphClientV3` manages token acquisition and refresh automatically.
- Least privilege: only `User.Read` and `Mail.Read` are requested (not `Mail.ReadWrite` or broader scopes).

## 6. Deployment Security

- HTTPS enforced on production domain (`oasistech.jasevo.com`).
- Environment variables managed through Dokploy's secure configuration (not in Docker images).
- No secrets committed to source control.
- `PAYLOAD_SECRET` should be a cryptographically random string of at least 32 characters.
