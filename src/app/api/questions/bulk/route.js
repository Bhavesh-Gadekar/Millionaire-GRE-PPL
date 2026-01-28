import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { v4 as uuid } from "uuid";

export const runtime = "nodejs"; // server-only

export async function POST(req) {
  try {
    const body = await req.json();

    if (!Array.isArray(body.questions) || !body.questions.length) {
      return new Response(
        JSON.stringify({ error: "No questions provided" }),
        { status: 400 }
      );
    }

    // Add UUID and timestamp to each question
    const questionsToInsert = body.questions.map((q) => ({
      id: uuid(),
      question_text: q.question_text || "",
      option_a: q.option_a || null,
      option_b: q.option_b || null,
      option_c: q.option_c || null,
      option_d: q.option_d || null,
      correct_option: q.correct_option || null,
      section_type: q.section_type || "VERBAL",
      created_at: new Date().toISOString(),
    }));

    const { data, error } = await supabaseAdmin
      .from("questions")
      .insert(questionsToInsert)
      .select();

    if (error) throw error;

    return new Response(JSON.stringify({ inserted: data.length }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
