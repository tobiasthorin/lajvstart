alter table "public"."events" add column "external_website_url" text;

alter table "public"."events" alter column "description_short" set not null;


