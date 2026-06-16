import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "tasks"
    ADD COLUMN IF NOT EXISTS "assignee_id" integer REFERENCES "api_users"("id") ON DELETE SET NULL;

    CREATE INDEX IF NOT EXISTS "tasks_assignee_idx" ON "tasks" USING btree ("assignee_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "tasks_assignee_idx";
    ALTER TABLE "tasks" DROP COLUMN IF EXISTS "assignee_id";
  `)
}
