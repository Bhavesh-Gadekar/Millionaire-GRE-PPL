"use server"; // makes this a server action
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { v4 as uuid } from "uuid";

// Fetch all questions
export async function getQuestions() {
  const { data, error } = await supabaseAdmin
    .from("questions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data; // directly return data
}

// Create a single question
export async function createQuestion(payload) {
  if (!payload.question_text || !payload.section_type) {
    throw new Error("question_text and section_type are required");
  }

  const newQuestion = {
    id: uuid(),
    question_text: payload.question_text,
    option_a: payload.option_a || null,
    option_b: payload.option_b || null,
    option_c: payload.option_c || null,
    option_d: payload.option_d || null,
    correct_option: payload.correct_option || null,
    section_type: payload.section_type,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabaseAdmin
    .from("questions")
    .insert(newQuestion)
    .select()
    .single();

  if (error) throw error;
  return data; // return the inserted row
}

// Create multiple questions (bulk)
export async function createBulkQuestions(questionsArray) {
  if (!Array.isArray(questionsArray) || questionsArray.length === 0) {
    throw new Error("No questions provided");
  }

  const questionsToInsert = questionsArray.map((q) => ({
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
  return { inserted: data.length }; // return number of inserted rows
}

// Update a question by ID
export async function updateQuestion(payload) {
  if (!payload.id) throw new Error("Question ID is required");

  const { data, error } = await supabaseAdmin
    .from("questions")
    .update({
      question_text: payload.question_text,
      option_a: payload.option_a || null,
      option_b: payload.option_b || null,
      option_c: payload.option_c || null,
      option_d: payload.option_d || null,
      correct_option: payload.correct_option || null,
      section_type: payload.section_type,
    })
    .eq("id", payload.id)
    .select()
    .single();

  if (error) throw error;
  return data; // return updated row
}
