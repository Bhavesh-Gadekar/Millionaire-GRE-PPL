"use client";

import { useRouter } from "next/navigation";
import Questionform from "@/components/admin/Questionform";
import { useQuestionsStore } from "@/store/questionsStore";

export default function CreateQuestionPage() {
  const router = useRouter();
  const addQuestion = useQuestionsStore((s) => s.addQuestion);

  const handleSubmit = async (payload) => {
    try {
      // 1️⃣ Call your server API
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // Safely handle HTML or JSON errors
        const text = await res.text();
        let errorMsg = "Failed to save question";

        try {
          const data = JSON.parse(text); // try parse JSON
          errorMsg = data.error || errorMsg;
        } catch {
          errorMsg = text; // fallback: raw HTML
        }

        throw new Error(errorMsg);
      }

      // 2️⃣ Parse inserted row
      const inserted = await res.json();

      // 3️⃣ Update your local store
      addQuestion(inserted);

      // 4️⃣ Redirect to questions list
      router.push("/admin/questions");
    } catch (err) {
      // Show alert with meaningful error
      alert(err.message);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Question</h1>

      <Questionform onSubmit={handleSubmit} />
    </div>
  );
}
