import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "site_visits" (
      "id" serial PRIMARY KEY NOT NULL,
      "page" varchar NOT NULL,
      "ip_address" varchar,
      "country" varchar,
      "city" varchar,
      "browser" varchar,
      "os" varchar,
      "device" varchar DEFAULT 'unknown',
      "referrer" varchar,
      "user_agent" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE INDEX IF NOT EXISTS "site_visits_updated_at_idx" ON "site_visits" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "site_visits_created_at_idx" ON "site_visits" USING btree ("created_at");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "site_visits";`)
}
