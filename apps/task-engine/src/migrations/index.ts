import * as migration_20250325_000000_add_site_visits from './20250325_000000_add_site_visits'

export const migrations = [
  {
    up: migration_20250325_000000_add_site_visits.up,
    down: migration_20250325_000000_add_site_visits.down,
    name: '20250325_000000_add_site_visits',
  },
]
