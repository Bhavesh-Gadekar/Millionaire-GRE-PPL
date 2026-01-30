"use client";

import { useState, useTransition } from "react";
import { FileSpreadsheet, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { parseQuestionsExcel } from "@/utils/parseQuestionsExcel";
import { createBulkQuestions } from "@/actions/admin_B/questions"; // ✅ server action

export default function QuestionBulkUpload({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [count, setCount] = useState(0);
  const [isPending, startTransition] = useTransition();

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError("");
    setCount(0);

    startTransition(async () => {
      try {
        // 1️⃣ Parse Excel / CSV on client
        const rows = await parseQuestionsExcel(file);

        if (!rows.length) throw new Error("No valid questions found");

        // 2️⃣ Call server action directly (no fetch!)
        const result = await createBulkQuestions(rows);

        setCount(rows.length);
        onSuccess?.();
      } catch (err) {
        setError(err.message || "Upload failed");
      } finally {
        setLoading(false);
        e.target.value = "";
      }
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">Bulk Upload Questions</h3>
        <p className="text-sm text-gray-500 mt-1">
          Upload questions using an Excel (.xlsx) or CSV file
        </p>
      </div>

      <label
        className={`flex flex-col items-center justify-center gap-3
          border-2 border-dashed rounded-xl p-6 cursor-pointer transition
          ${
            loading
              ? "border-gray-300 bg-gray-50 cursor-not-allowed"
              : "border-blue-300 hover:border-blue-500 hover:bg-blue-50"
          }`}
      >
        <FileSpreadsheet className="w-10 h-10 text-blue-600" />
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">Click to upload or drag & drop</p>
          <p className="text-xs text-gray-500">Excel or CSV • Max size depends on browser</p>
        </div>
        <input type="file" accept=".xlsx,.csv" onChange={handleFile} disabled={loading} className="hidden" />
      </label>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-blue-600">
          <Upload className="w-4 h-4 animate-pulse" />
          Uploading questions…
        </div>
      )}

      {count > 0 && !loading && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle className="w-4 h-4" />
          {count} questions uploaded successfully
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="text-xs text-gray-500 border-t pt-3">
        <p className="font-medium mb-1">Required Excel columns:</p>
        <code className="block bg-gray-50 p-2 rounded text-gray-700">
          question_text, option_a, option_b, option_c, option_d, section_type, correct_option
        </code>
      </div>
    </div>
  );
}
