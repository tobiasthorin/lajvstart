

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "moddatetime" WITH SCHEMA "public";






CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_jsonschema" WITH SCHEMA "public";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."event_groups" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text",
    "description" "text",
    "event_id" "uuid",
    "deleted" boolean DEFAULT false NOT NULL,
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."event_groups" OWNER TO "postgres";


COMMENT ON TABLE "public"."event_groups" IS 'Groups of participants in an event';



CREATE TABLE IF NOT EXISTS "public"."events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" DEFAULT ''::"text" NOT NULL,
    "description" "text" DEFAULT ''::"text" NOT NULL,
    "date_start" "date" NOT NULL,
    "date_end" "date" NOT NULL,
    "date_signup" "date",
    "location_name" "text",
    "location_longitude" double precision,
    "location_latitude" double precision,
    "event_image_url" "text",
    "is_beginner_friendly" boolean DEFAULT false NOT NULL,
    "minimum_age" smallint,
    "tags" "text"[],
    "owner_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "description_short" "text",
    "maximum_participants" integer DEFAULT 0 NOT NULL,
    "display_mode" boolean DEFAULT false NOT NULL,
    "is_published" boolean DEFAULT false NOT NULL,
    "price" integer DEFAULT 0 NOT NULL,
    "currency" "text" DEFAULT 'SEK'::"text" NOT NULL,
    "updated_at" timestamp with time zone,
    "details" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL
);


ALTER TABLE "public"."events" OWNER TO "postgres";


COMMENT ON TABLE "public"."events" IS 'LARP events';



COMMENT ON COLUMN "public"."events"."description_short" IS 'For display in cards etc';



CREATE TABLE IF NOT EXISTS "public"."favourites" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid",
    "event_id" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."favourites" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."registrations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "event_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "is_paid" boolean DEFAULT false NOT NULL,
    "details" "jsonb",
    "user_details" "uuid",
    "deleted" boolean DEFAULT false,
    "event_group" "uuid",
    "is_approved" boolean DEFAULT false NOT NULL,
    "updated_at" timestamp with time zone,
    CONSTRAINT "registrations_details_check" CHECK ("public"."jsonb_matches_schema"('{
          "type": "array",
          "items": {
              "type": "object",
              "properties": {
                "name": {"type": "string"},
                "value": {"type": "string"},
                "type": {"type": "string"}
              }
          }
        }'::"json", "details"))
);


ALTER TABLE "public"."registrations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_details" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "name" "text",
    "birth_date" "date" NOT NULL,
    "biography" "text",
    "profile_picture_url" "text",
    "special_needs" "text",
    "birth_date_public" boolean DEFAULT false NOT NULL,
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."user_details" OWNER TO "postgres";


COMMENT ON TABLE "public"."user_details" IS 'Additional user data';



ALTER TABLE ONLY "public"."event_groups"
    ADD CONSTRAINT "event_groups_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."favourites"
    ADD CONSTRAINT "favourites_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."registrations"
    ADD CONSTRAINT "registrations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_details"
    ADD CONSTRAINT "userDetails_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_details"
    ADD CONSTRAINT "userDetails_userId_key" UNIQUE ("user_id");



CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."event_groups" FOR EACH ROW EXECUTE FUNCTION "public"."moddatetime"('updated_at');



CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."events" FOR EACH ROW EXECUTE FUNCTION "public"."moddatetime"('updated_at');



CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."favourites" FOR EACH ROW EXECUTE FUNCTION "public"."moddatetime"('updated_at');



CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."registrations" FOR EACH ROW EXECUTE FUNCTION "public"."moddatetime"('updated_at');



CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."user_details" FOR EACH ROW EXECUTE FUNCTION "public"."moddatetime"('updated_at');



ALTER TABLE ONLY "public"."event_groups"
    ADD CONSTRAINT "event_groups_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."favourites"
    ADD CONSTRAINT "favourites_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."favourites"
    ADD CONSTRAINT "favourites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "public_events_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."registrations"
    ADD CONSTRAINT "public_registrations_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."registrations"
    ADD CONSTRAINT "public_registrations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."registrations"
    ADD CONSTRAINT "registrations_event_group_fkey" FOREIGN KEY ("event_group") REFERENCES "public"."event_groups"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."registrations"
    ADD CONSTRAINT "registrations_user_details_fkey" FOREIGN KEY ("user_details") REFERENCES "public"."user_details"("user_id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."user_details"
    ADD CONSTRAINT "userDetails_userId_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



CREATE POLICY "Enable delete for users based on user_id" ON "public"."favourites" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Enable insert for all" ON "public"."user_details" FOR INSERT TO "authenticated", "anon" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."event_groups" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."events" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."favourites" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."registrations" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable insert for users based on user_id" ON "public"."registrations" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Enable read access for authenticated" ON "public"."event_groups" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable read access for authenticated users" ON "public"."favourites" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable read for public" ON "public"."events" FOR SELECT USING (true);



CREATE POLICY "Enable update for authenticated users only" ON "public"."registrations" FOR UPDATE TO "authenticated" USING (true);



CREATE POLICY "Enable update for users based on owner_id" ON "public"."events" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "owner_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "owner_id"));



CREATE POLICY "Enable update for users based on user_id" ON "public"."favourites" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Enable update for users based on user_id" ON "public"."user_details" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Public user details are viewable by authenticated" ON "public"."user_details" FOR SELECT TO "authenticated" USING (true);



ALTER TABLE "public"."event_groups" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."favourites" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."registrations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_details" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";
































































































































































































GRANT ALL ON FUNCTION "public"."json_matches_schema"("schema" "json", "instance" "json") TO "postgres";
GRANT ALL ON FUNCTION "public"."json_matches_schema"("schema" "json", "instance" "json") TO "anon";
GRANT ALL ON FUNCTION "public"."json_matches_schema"("schema" "json", "instance" "json") TO "authenticated";
GRANT ALL ON FUNCTION "public"."json_matches_schema"("schema" "json", "instance" "json") TO "service_role";



GRANT ALL ON FUNCTION "public"."jsonb_matches_schema"("schema" "json", "instance" "jsonb") TO "postgres";
GRANT ALL ON FUNCTION "public"."jsonb_matches_schema"("schema" "json", "instance" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."jsonb_matches_schema"("schema" "json", "instance" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."jsonb_matches_schema"("schema" "json", "instance" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."jsonschema_is_valid"("schema" "json") TO "postgres";
GRANT ALL ON FUNCTION "public"."jsonschema_is_valid"("schema" "json") TO "anon";
GRANT ALL ON FUNCTION "public"."jsonschema_is_valid"("schema" "json") TO "authenticated";
GRANT ALL ON FUNCTION "public"."jsonschema_is_valid"("schema" "json") TO "service_role";



GRANT ALL ON FUNCTION "public"."jsonschema_validation_errors"("schema" "json", "instance" "json") TO "postgres";
GRANT ALL ON FUNCTION "public"."jsonschema_validation_errors"("schema" "json", "instance" "json") TO "anon";
GRANT ALL ON FUNCTION "public"."jsonschema_validation_errors"("schema" "json", "instance" "json") TO "authenticated";
GRANT ALL ON FUNCTION "public"."jsonschema_validation_errors"("schema" "json", "instance" "json") TO "service_role";



GRANT ALL ON FUNCTION "public"."moddatetime"() TO "postgres";
GRANT ALL ON FUNCTION "public"."moddatetime"() TO "anon";
GRANT ALL ON FUNCTION "public"."moddatetime"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."moddatetime"() TO "service_role";





















GRANT ALL ON TABLE "public"."event_groups" TO "anon";
GRANT ALL ON TABLE "public"."event_groups" TO "authenticated";
GRANT ALL ON TABLE "public"."event_groups" TO "service_role";



GRANT ALL ON TABLE "public"."events" TO "anon";
GRANT ALL ON TABLE "public"."events" TO "authenticated";
GRANT ALL ON TABLE "public"."events" TO "service_role";



GRANT ALL ON TABLE "public"."favourites" TO "anon";
GRANT ALL ON TABLE "public"."favourites" TO "authenticated";
GRANT ALL ON TABLE "public"."favourites" TO "service_role";



GRANT ALL ON TABLE "public"."registrations" TO "anon";
GRANT ALL ON TABLE "public"."registrations" TO "authenticated";
GRANT ALL ON TABLE "public"."registrations" TO "service_role";



GRANT ALL ON TABLE "public"."user_details" TO "anon";
GRANT ALL ON TABLE "public"."user_details" TO "authenticated";
GRANT ALL ON TABLE "public"."user_details" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
