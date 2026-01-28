"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useQuestionsStore } from "@/store/questionsStore";
// import  Sidebar from "@/components/admin/Sidebar";
import QuestionBulkUpload from "@/components/admin/QuestionBulkUpload";

export default function QuestionsPage() {
  const router = useRouter();
  const { questions, setQuestions, deleteQuestion } = useQuestionsStore();

  // Fetch questions on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/questions");
        if (!res.ok) throw new Error("Failed to fetch questions");

        const data = await res.json();
        setQuestions(data); // update store
      } catch (err) {
        console.error("Error fetching questions:", err);
      }
    };

    fetchQuestions();
  }, [setQuestions]);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Questions</h1>
          <p className="text-sm text-gray-500">Manage question bank</p>
        </div>

        <button
          onClick={() => router.push("/admin/questions/create")}
          className="btn-blue flex items-center gap-2"
        >
          <Plus size={16} />
          Create Question
        </button>
      </div>

      {/* Bulk Upload */}
      <QuestionBulkUpload onSuccess={() => router.refresh()} />

      {/* Questions Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden mt-6">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left text-sm text-gray-600">
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Question</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {questions.map((q) => (
              <tr key={q.id} className="border-b last:border-0 hover:bg-gray-50">
                {/* Show shortened ID, but full ID is used in routing */}
                <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                  {q.id.slice(0, 8)}
                </td>

                <td className="px-6 py-4 font-medium">{q.question_text}</td>

                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                    {q.section_type}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    {/* Edit button uses full UUID */}
                    <button
                      onClick={() => router.push(`/admin/questions/edit/${q.id}`)}
                      className="icon-btn text-blue-600"
                    >
                      <Pencil size={16} />
                    </button>

                    {/* Delete question */}
                    <button
                      onClick={() => deleteQuestion(q.id)}
                      className="icon-btn text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {questions.length === 0 && (
          <div className="py-16 text-center text-gray-500">
            No questions added yet
          </div>
        )}
      </div>
    </div>
  );
}
