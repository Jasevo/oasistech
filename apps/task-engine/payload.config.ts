import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { Tasks } from './src/collections/Tasks'
import { Projects } from './src/collections/Projects'
import { ApiUsers } from './src/collections/ApiUsers'
import { SiteVisits } from './src/collections/SiteVisits'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'api-users',
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      afterLogin: ['./src/components/admin/TestCredentials#default'],
      beforeNavLinks: ['./src/components/admin/NavLogo#default'],
      beforeDashboard: ['./src/components/admin/DashboardBanner#default'],
    },
  },
  collections: [Tasks, Projects, ApiUsers, SiteVisits],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    push: true,
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
})
