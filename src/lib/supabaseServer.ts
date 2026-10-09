import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!serviceRoleKey && process.env.NODE_ENV !== "test") {
  console.warn(
    "[SECURITY WARNING] SUPABASE_SERVICE_ROLE_KEY is not defined. Falling back to NEXT_PUBLIC_SUPABASE_ANON_KEY on server. Ensure SUPABASE_SERVICE_ROLE_KEY is set in environment variables for secure RLS bypass."
  );
}

// Server-side admin client using service_role key to bypass RLS policies securely
export const supabaseAdmin = createClient(
  supabaseUrl,
  serviceRoleKey || anonKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
