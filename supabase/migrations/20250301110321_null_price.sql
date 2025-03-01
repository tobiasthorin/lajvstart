alter table "public"."events" alter column "price" drop default;

alter table "public"."events" alter column "price" drop not null;


