import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "task_comments" (
      "id" serial PRIMARY KEY NOT NULL,
      "task_id" integer,
      "author_id" integer,
      "body" varchar NOT NULL,
      "mentioned_task_id" integer,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE INDEX IF NOT EXISTS "task_comments_task_idx" ON "task_comments" USING btree ("task_id");
    CREATE INDEX IF NOT EXISTS "task_comments_author_idx" ON "task_comments" USING btree ("author_id");
    CREATE INDEX IF NOT EXISTS "task_comments_mentioned_task_idx" ON "task_comments" USING btree ("mentioned_task_id");
    CREATE INDEX IF NOT EXISTS "task_comments_created_at_idx" ON "task_comments" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "task_comments_updated_at_idx" ON "task_comments" USING btree ("updated_at");

    CREATE TABLE IF NOT EXISTS "messages" (
      "id" serial PRIMARY KEY NOT NULL,
      "from_id" integer,
      "to_id" integer,
      "subject" varchar NOT NULL,
      "body" varchar NOT NULL,
      "read" boolean DEFAULT false,
      "linked_task_id" integer,
      "linked_project_id" integer,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE INDEX IF NOT EXISTS "messages_from_idx" ON "messages" USING btree ("from_id");
    CREATE INDEX IF NOT EXISTS "messages_to_idx" ON "messages" USING btree ("to_id");
    CREATE INDEX IF NOT EXISTS "messages_linked_task_idx" ON "messages" USING btree ("linked_task_id");
    CREATE INDEX IF NOT EXISTS "messages_linked_project_idx" ON "messages" USING btree ("linked_project_id");
    CREATE INDEX IF NOT EXISTS "messages_created_at_idx" ON "messages" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "messages_updated_at_idx" ON "messages" USING btree ("updated_at");

    -- Payload's polymorphic relation tables need an "<table>_id" column for every
    -- collection. Earlier feature migrations created the collection tables but never
    -- backfilled these columns, which broke document lock checks on update/delete.
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "site_visits_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "activity_logs_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "task_comments_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "messages_id" integer;

    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_site_visits_id_idx" ON "payload_locked_documents_rels" USING btree ("site_visits_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_activity_logs_id_idx" ON "payload_locked_documents_rels" USING btree ("activity_logs_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_task_comments_id_idx" ON "payload_locked_documents_rels" USING btree ("task_comments_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_messages_id_idx" ON "payload_locked_documents_rels" USING btree ("messages_id");

    ALTER TABLE "payload_preferences_rels" ADD COLUMN IF NOT EXISTS "site_visits_id" integer;
    ALTER TABLE "payload_preferences_rels" ADD COLUMN IF NOT EXISTS "activity_logs_id" integer;
    ALTER TABLE "payload_preferences_rels" ADD COLUMN IF NOT EXISTS "task_comments_id" integer;
    ALTER TABLE "payload_preferences_rels" ADD COLUMN IF NOT EXISTS "messages_id" integer;

    CREATE INDEX IF NOT EXISTS "payload_preferences_rels_site_visits_id_idx" ON "payload_preferences_rels" USING btree ("site_visits_id");
    CREATE INDEX IF NOT EXISTS "payload_preferences_rels_activity_logs_id_idx" ON "payload_preferences_rels" USING btree ("activity_logs_id");
    CREATE INDEX IF NOT EXISTS "payload_preferences_rels_task_comments_id_idx" ON "payload_preferences_rels" USING btree ("task_comments_id");
    CREATE INDEX IF NOT EXISTS "payload_preferences_rels_messages_id_idx" ON "payload_preferences_rels" USING btree ("messages_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_preferences_rels" DROP COLUMN IF EXISTS "messages_id";
    ALTER TABLE "payload_preferences_rels" DROP COLUMN IF EXISTS "task_comments_id";
    ALTER TABLE "payload_preferences_rels" DROP COLUMN IF EXISTS "activity_logs_id";
    ALTER TABLE "payload_preferences_rels" DROP COLUMN IF EXISTS "site_visits_id";

    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "messages_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "task_comments_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "activity_logs_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "site_visits_id";

    DROP TABLE IF EXISTS "messages";
    DROP TABLE IF EXISTS "task_comments";
  `)
}
