import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs"; // server-only

// GET question by ID
export async function GET(req, { params }) {
  try {
    const { id } = await params; // ✅ unwrap params as a promise
    if (!id) {
      return new Response(
        JSON.stringify({ error: "Question ID is required" }),
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("questions")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Failed to fetch question" }),
      { status: 500 }
    );
  }
}

// PATCH update question by ID
export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return new Response(
        JSON.stringify({ error: "Question ID is required" }),
        { status: 400 }
      );
    }

    const body = await req.json();

    const updateData = {
      question_text: body.question_text,
      option_a: body.option_a,
      option_b: body.option_b,
      option_c: body.option_c,
      option_d: body.option_d,
      correct_option: body.correct_option,
      section_type: body.section_type,
    };

    const { data, error } = await supabaseAdmin
      .from("questions")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Failed to update question" }),
      { status: 500 }
    );
  }
}
