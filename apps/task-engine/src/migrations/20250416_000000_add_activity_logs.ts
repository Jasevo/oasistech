import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "activity_logs" (
      "id" serial PRIMARY KEY NOT NULL,
      "collection" varchar NOT NULL,
      "document_id" varchar NOT NULL,
      "document_title" varchar,
      "action" varchar NOT NULL,
      "actor" varchar DEFAULT 'Admin',
      "changes" jsonb,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE INDEX IF NOT EXISTS "activity_logs_collection_idx" ON "activity_logs" USING btree ("collection");
    CREATE INDEX IF NOT EXISTS "activity_logs_document_id_idx" ON "activity_logs" USING btree ("document_id");
    CREATE INDEX IF NOT EXISTS "activity_logs_action_idx" ON "activity_logs" USING btree ("action");
    CREATE INDEX IF NOT EXISTS "activity_logs_updated_at_idx" ON "activity_logs" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "activity_logs_created_at_idx" ON "activity_logs" USING btree ("created_at");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "activity_logs";`)
}
