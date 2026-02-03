"use client";

import { useEffect, useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus, Database, Filter } from "lucide-react";
import { useQuestionsStore } from "@/store/questionsStore";
import QuestionBulkUpload from "@/components/admin/QuestionBulkUpload";
import { getQuestions, deleteQuestionById } from "@/actions/admin_B/questions";

export default function QuestionsPage() {
  const router = useRouter();
  const { questions, setQuestions, deleteQuestion } = useQuestionsStore();
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState("ALL"); // ALL, VERBAL, QUANT

  // Fetch questions on mount
  useEffect(() => {
    startTransition(async () => {
      try {
        const data = await getQuestions();
        setQuestions(data);
      } catch (err) {
        console.error("Error fetching questions:", err);
      }
    });
  }, [setQuestions]);

  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this question?")) return;

    startTransition(async () => {
      try {
        await deleteQuestionById(id);
        deleteQuestion(id);
      } catch (err) {
        console.error("Failed to delete question:", err);
      }
    });
  };

  const filteredQuestions = questions.filter(
    (q) => filter === "ALL" || q.section_type === filter
  );

  return (
    <div className="h-[calc(100vh-64px)] pb-3 px-6 bg-slate-50/50 flex flex-col gap-3">

      {/* 1. Header & Create Action */}
      <div className="flex items-center justify-between shrink-0 pt-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            Question Bank
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold border border-blue-200">
              {filteredQuestions.length} Questions
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter Dropdown */}
          <div className="relative">
            <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-8 pr-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 appearance-none cursor-pointer hover:bg-slate-50 min-w-[140px]"
            >
              <option value="ALL">All Sections</option>
              <option value="VERBAL">Verbal Only</option>
              <option value="QUANT">Quant Only</option>
            </select>
          </div>

          <button
            onClick={() => router.push("/admin/questions/create")}
            className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-bold text-xs border border-transparent cursor-pointer"
          >
            <Plus size={16} />
            Create
          </button>
        </div>
      </div>

      {/* 2. Questions Table (Main Focus) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-1 min-h-0 relative">
        <div className="overflow-y-auto flex-1 p-0 custom-scrollbar">
          <table className="w-full relative border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10 shadow-sm">
              <tr className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-3 bg-slate-50 w-24">ID</th>
                <th className="px-6 py-3 bg-slate-50">Question Text</th>
                <th className="px-6 py-3 bg-slate-50 w-32">Section</th>
                <th className="px-6 py-3 text-right bg-slate-50 w-28">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredQuestions.map((q) => (
                <tr key={q.id} className="hover:bg-blue-50/50 transition-colors group">
                  <td className="px-6 py-2.5 text-[10px] font-mono text-slate-400 group-hover:text-slate-500">
                    {q.id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-2.5">
                    <p className="text-xs font-medium text-slate-800 line-clamp-1 group-hover:text-blue-900">
                      {q.question_text}
                    </p>
                  </td>
                  <td className="px-6 py-2.5">
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded border ${q.section_type === 'QUANT'
                      ? 'bg-blue-50 text-blue-700 border-blue-100'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      }`}>
                      {q.section_type}
                    </span>
                  </td>
                  <td className="px-6 py-2.5">
                    <div className="flex justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => router.push(`/admin/questions/edit/${q.id}`)}
                        className="p-1.5 bg-white text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-slate-200 hover:border-blue-600"
                        title="Edit"
                      >
                        <Pencil size={14} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={() => handleDelete(q.id)}
                        className="p-1.5 bg-white text-red-600 rounded-md hover:bg-red-600 hover:text-white transition-all shadow-sm border border-slate-200 hover:border-red-600"
                        title="Delete"
                      >
                        <Trash2 size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {questions.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/30">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3 border border-blue-100 shadow-sm">
              <Plus className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-slate-900 font-bold text-sm">No questions yet</h3>
            <p className="text-slate-500 font-medium text-xs mt-1">
              Start by creating or uploading questions.
            </p>
          </div>
        )}
      </div>

      {/* 3. Bulk Upload (Bottom) */}
      <div className="shrink-0">
        <QuestionBulkUpload
          onSuccess={() =>
            startTransition(async () => {
              const refreshed = await getQuestions();
              setQuestions(refreshed);
            })
          }
        />
      </div>
    </div>
  );
}
