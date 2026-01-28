import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { v4 as uuid } from "uuid";

export const runtime = "nodejs"; // server-only

// GET all questions
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("questions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.error("GET /api/questions error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// POST a single question
export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.question_text || !body.section_type) {
      return new Response(
        JSON.stringify({ error: "question_text and section_type are required" }),
        { status: 400 }
      );
    }

    const newQuestion = {
      id: uuid(),
      question_text: body.question_text,
      option_a: body.option_a || null,
      option_b: body.option_b || null,
      option_c: body.option_c || null,
      option_d: body.option_d || null,
      correct_option: body.correct_option || null,
      section_type: body.section_type,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from("questions")
      .insert(newQuestion)
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.error("POST /api/questions error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
