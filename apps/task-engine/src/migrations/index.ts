import * as migration_20250325_000000_add_site_visits from './20250325_000000_add_site_visits'
import * as migration_20250416_000000_add_activity_logs from './20250416_000000_add_activity_logs'

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
]
