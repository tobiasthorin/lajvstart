alter table "public"."characters" add column "deleted" boolean not null default false;

alter table "public"."characters" add column "updated_at" date;

create policy "Enable delete for users based on user_id"
on "public"."characters"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = user_id));



