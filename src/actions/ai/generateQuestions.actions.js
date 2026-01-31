'use server'

import { createClient } from '@/lib/supabase/server'
import { GoogleGenAI } from '@google/genai'

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
})

/**
 * ADMIN AI GENERATOR
 * Admin inputs ONLY a topic keyword (e.g. "probability")
 * System enforces GRE/PPL format and accuracy
 */
export async function sendMessage(topic) {
  const supabase = await createClient()

  /* ---------------- PERMANENT BASE CONTEXT ---------------- */

  const BASE_CONTEXT = `
You are an expert GRE/PPL exam question generator.

Always generate questions in the following GRE/PPL structure:

GRE/PPL Style Questions

Verbal Reasoning:
- Text Completion
- Sentence Equivalence
- Reading Comprehension

Quantitative Reasoning:
- Problem Solving
- Quantitative Comparison

Rules:
- Follow official GRE/PPL exam standards
- Questions must be accurate and exam-oriented
- Stay strictly within the given topic
- Do NOT include unrelated concepts
- Do NOT add unnecessary explanations
- Use clear headings and instructions
`

  /* ---------------- AI PROMPT (ADMIN TYPES ONLY A TOPIC) ---------------- */

  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `
${BASE_CONTEXT}

Generate GRE/PPL style questions ONLY on the following topic:
"${topic}"

Constraints:
- Topic must match exactly
- Generate 5–10 questions
- Maintain proper GRE/PPL difficulty
`
        }
      ]
    }
  ]

  /* ---------------- GEMINI CALL ---------------- */

  const result = await genAI.models.generateContent({
    model: 'gemini-2.5-flash',
    contents
  })

  /* ---------------- SAFE TEXT EXTRACTION ---------------- */

  const aiText =
    result?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

  if (!aiText) {
    throw new Error('AI returned empty response')
  }

  /* ---------------- OPTIONAL: STORE OUTPUT (ANONYMOUS) ---------------- */

  await supabase.from('chat_messages').insert({
    role: 'assistant',
    text: aiText
  })

  /* ---------------- RETURN TO UI ---------------- */

  return aiText
}
