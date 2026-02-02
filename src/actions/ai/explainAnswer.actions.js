'use server'

import { GoogleGenAI } from '@google/genai';

const askGemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
})

/*
    Used at runtime on the student answer
    On-demand Explanation Generation
    Non Persistance Answers

 */
export default async function generateAnswerExplanation(question, correctAnswer, studentAnswer){
    // PROMPT GENERATION
    const PROMPT = GENERATE_FEEDBACK_PROMPT(question, correctAnswer, studentAnswer);

    /* GEMINI API CALL */
    const geminiResponse = await askGemini.models.generateContent({

        model: 'gemini-2.5-flash',
        contents: [{
            parts: [
                { text: PROMPT },
                ]
            }] ,
        config: { responseMimeType: 'application/json' },
    })

    const rawOutput = geminiResponse.text;

    let cleanOutput;

    /*ENSURING THE MODEL RETURN CORRCT FORMAT*/
    try {

        cleanOutput = JSON.parse(rawOutput);

    }catch(parseError){
        console.error("Json Parse Failed")
        console.log(rawOutput);
        return
    }

    return cleanOutput

}



const GENERATE_FEEDBACK_PROMPT = (question, correctAnswer, studentAnswer) => `
You are a master GRE/PPL instructor known for high-impact, concise feedback. 
Your goal is to clarify the "Deterministic Logic"—the exact reason why one answer is strictly correct and the other is strictly wrong.

INPUT DATA:
- Question: "${question}"
- Correct Answer: "${correctAnswer}"
- Student Answer: "${studentAnswer}"

INSTRUCTIONS:
1. COMPARING:
   - If the student is CORRECT: Reinforce *why* their logic held up. Mention the specific keyword or calculation that secured the win.
   - If the student is WRONG: Do not just state the right answer. Pinpoint exactly where their logic disconnected (e.g., "You missed the contrast signal word 'however'..." or "You calculated the radius but needed the diameter...").

2. EXPLANATION STYLE (Deterministic):
   - Be strictly evidence-based. Quote the question text or cite the specific math rule.
   - Avoid vague phrases like "Option B is slightly better." Say "Option B is correct because [Rule X] applies."
   - Keep it under 50 words.


FORMAT: STRICTLY JSON {  
    Status: Correct/Incorrect
    Logic: The crisp explanation
}

OUTPUT EXAMPLE:
Incorrect. 
You chose 'A' based on the initial phrase, but the sentence shifts direction at "nonetheless." This signal word mandates a contrasting idea, which makes 'C' the only valid choice. 
Good attempt—keep scanning for those signal words in the next one!
`