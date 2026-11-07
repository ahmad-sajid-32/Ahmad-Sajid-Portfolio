import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Adds the Socials global (Globals → Social Links): one row
 * table plus its links array table and the platform enum.
 * NOTE: this migration was authored by hand to mirror the
 * schema the Postgres adapter generates for the global —
 * the payload CLI could not run in the authoring sandbox
 * (undici/Node 24 crash) — and the schema was applied to the
 * live database first via a dev-mode push, then verified
 * against information_schema before this file was written.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_socials_links_platform" AS ENUM('github', 'linkedin', 'instagram', 'facebook', 'fiverr', 'upwork', 'x', 'youtube', 'whatsapp', 'email', 'phone', 'website');
   CREATE TABLE "socials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
   CREATE TABLE "socials_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_socials_links_platform" NOT NULL,
  	"url" varchar NOT NULL,
  	"label" varchar
  );
   ALTER TABLE "socials_links" ADD CONSTRAINT "socials_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."socials"("id") ON DELETE cascade ON UPDATE no action;
   CREATE INDEX "socials_links_order_idx" ON "socials_links" USING btree ("_order");
   CREATE INDEX "socials_links_parent_id_idx" ON "socials_links" USING btree ("_parent_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "socials_links" CASCADE;
   DROP TABLE "socials" CASCADE;
   DROP TYPE "public"."enum_socials_links_platform";`)
}
