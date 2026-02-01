"use server";
import { createSupabaseServerClient } from "@/lib/supabase/server";


export async function getTestQuestions(testId) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("test_questions")
      .select(`
        questions (
          id,
          question_text,
          option_a,
          option_b,
          option_c,
          option_d,
          correct_option,
          section_type
        )
      `)
      .eq("test_id", testId);

    if (error) throw error;
    const questions = data.map((row) => row.questions);
    return { success: true, data: questions };
  } catch (err) {
    console.error("getTestQuestions error:", err);
    return { success: false, error: err.message };
  }
}

export async function upsertTestResult({
  student_name,
  email,
  score,
  test_id,
  attempt_no,
}) {
  try {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
      .from("test_results")
      .upsert(
        {
          student_name, // just for display
          email,        // identity
          score,
          test_id,
          attempt_no,
        },
        {
          onConflict: "test_id,email",
        }
      );

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error("upsertTestResult error:", err);
    return { success: false, error: err.message };
  }
}


// actions/student/test.actions.js
export async function getAttemptInfo(testId, email) {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("test_results")
      .select("attempt_no")
      .eq("test_id", testId)
      .eq("email", email)
      .single();

    // no row yet → first attempt
    if (error && error.code !== "PGRST116") throw error;

    return {
      success: true,
      attemptNo: data?.attempt_no ?? 0,
    };
  } catch (err) {
    console.error("getAttemptInfo error:", err);
    return { success: false, error: err.message };
  }
}


export async function getPublishedTests() {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("tests")
      .select("*")
      .eq("is_published",true) // only published tests
      .order("created_at", { ascending: true });

    if (error) throw error;

    return { success: true, data };
  } catch (err) {
    console.error("getPublishedTests error:", err);
    return { success: false, error: err?.message || "Failed to fetch tests" };
  }
}