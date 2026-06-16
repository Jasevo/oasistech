import * as migration_20250325_000000_add_site_visits from './20250325_000000_add_site_visits'
import * as migration_20250416_000000_add_activity_logs from './20250416_000000_add_activity_logs'
import * as migration_20260616_000000_add_assignee_to_tasks from './20260616_000000_add_assignee_to_tasks'
import * as migration_20260616_000001_add_messaging_and_locked_rels from './20260616_000001_add_messaging_and_locked_rels'

export const migrations = [
  {
    up: migration_20250325_000000_add_site_visits.up,
    down: migration_20250325_000000_add_site_visits.down,
    name: '20250325_000000_add_site_visits',
  },
  {
    up: migration_20250416_000000_add_activity_logs.up,
    down: migration_20250416_000000_add_activity_logs.down,
    name: '20250416_000000_add_activity_logs',
  },
  {
    up: migration_20260616_000000_add_assignee_to_tasks.up,
    down: migration_20260616_000000_add_assignee_to_tasks.down,
    name: '20260616_000000_add_assignee_to_tasks',
  },
  {
    up: migration_20260616_000001_add_messaging_and_locked_rels.up,
    down: migration_20260616_000001_add_messaging_and_locked_rels.down,
    name: '20260616_000001_add_messaging_and_locked_rels',
  },
]
