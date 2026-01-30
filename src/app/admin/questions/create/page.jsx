"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Questionform from "@/components/admin/Questionform";
import { useQuestionsStore } from "@/store/questionsStore";
import {
  createQuestion,
  createBulkQuestions,
  getQuestions
} from "@/actions/admin_B/questions"; // ✅ import here

export default function CreateQuestionPage() {
  const router = useRouter();
  const addQuestion = useQuestionsStore((s) => s.addQuestion);
  const setQuestions = useQuestionsStore((s) => s.setQuestions);
  const [isPending, startTransition] = useTransition();

  // -----------------------------
  // Fetch all questions on demand
  // -----------------------------
  const fetchQuestions = () => {
    startTransition(async () => {
      try {
        const questions = await getQuestions(); // ✅ use here
        setQuestions(questions);
      } catch (err) {
        console.error("Failed to fetch questions:", err.message);
      }
    });
  };

  // -----------------------------
  // Single question submission
  // -----------------------------
  const handleSubmit = (payload) => {
    startTransition(async () => {
      try {
        const inserted = await createQuestion(payload); // ✅ use here
        addQuestion(inserted);
        router.push("/admin/questions");
      } catch (err) {
        alert(err.message);
      }
    });
  };

  // -----------------------------
  // Bulk upload submission
  // -----------------------------
  const handleBulkUpload = (questionsArray) => {
    startTransition(async () => {
      try {
        const result = await createBulkQuestions(questionsArray); // ✅ use here
        alert(`${result.inserted} questions added!`);
        const refreshed = await getQuestions(); // refresh list
        setQuestions(refreshed);
      } catch (err) {
        alert(err.message);
      }
    });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Create Questions</h1>

      {/* Single question form */}
      <Questionform onSubmit={handleSubmit} disabled={isPending} />

      {/* Bulk upload */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Bulk Upload</h2>
        <input
          type="file"
          accept=".xlsx,.csv,.json"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            let data = [];
            if (file.name.endsWith(".json")) {
              const text = await file.text();
              data = JSON.parse(text);
            } else {
              const XLSX = await import("xlsx");
              const arrayBuffer = await file.arrayBuffer();
              const workbook = XLSX.read(arrayBuffer);
              const sheetName = workbook.SheetNames[0];
              const sheet = workbook.Sheets[sheetName];
              data = XLSX.utils.sheet_to_json(sheet);
            }

            handleBulkUpload(data); // ✅ use server action
          }}
        />
      </div>

      {/* Fetch questions button */}
      <div className="mt-6">
        <button
          onClick={fetchQuestions} // ✅ use server action
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Refresh Questions
        </button>
      </div>
    </div>
  );
}
