"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Questionform from "@/components/admin/Questionform";

export default function EditQuestionPage() {
  const { id } = useParams(); // full question UUID from URL
  const router = useRouter();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch question by full UUID
  useEffect(() => {
    if (!id) {
      setError("Question ID is missing from URL");
      setLoading(false);
      return;
    }

    const fetchQuestion = async () => {
      try {
        const res = await fetch(`/api/questions/${id}`);
        const text = await res.text(); // avoid JSON errors
        const data = text ? JSON.parse(text) : null;

        if (!res.ok) throw new Error(data?.error || "Failed to fetch question");

        setQuestion(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id]);

  // Update question on server
  const handleUpdate = async (updatedData) => {
    if (!id) return setError("Question ID is missing");

    try {
      const res = await fetch(`/api/questions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : null;

      if (!res.ok) throw new Error(data?.error || "Failed to update question");

      router.push("/admin/questions"); // back to list
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading)
    return <div className="p-8 text-gray-500">Loading question...</div>;

  if (error)
    return (
      <div className="p-8 text-red-600">
        Error: {error}
      </div>
    );

  if (!question)
    return <div className="p-8 text-gray-500">Question not found</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Question</h1>

      <Questionform
        initialData={question}
        submitLabel="Update Question"
        onSubmit={handleUpdate}
      />
    </div>
  );
}
