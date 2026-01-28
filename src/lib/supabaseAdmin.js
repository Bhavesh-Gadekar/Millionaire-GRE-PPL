import { createClient } from "@supabase/supabase-js";

// ✅ Server-only client using service role
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,               // not NEXT_PUBLIC
  process.env.SUPABASE_SERVICE_ROLE_KEY,  // must be service role
  {
    auth: { persistSession: false },      // optional for server
  }
);
