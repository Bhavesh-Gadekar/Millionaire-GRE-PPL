"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

// Server-side login
export async function handleAdminLogin(email, password) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true };
}

// Get current session (for SSR)
export async function getCurrentSession() {
  const supabase = await createSupabaseServerClient();
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) return null;
  return session || null;
}

// Server-side logout
export async function handleLogout() {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true };
}
