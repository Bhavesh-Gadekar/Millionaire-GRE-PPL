"use client";

import { useEffect, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import Questionform from "@/components/admin/Questionform";
import { getQuestions, updateQuestion } from "@/actions/admin_B/questions"; // ✅ server actions

export default function EditQuestionPage() {
  const { id } = useParams(); // full question UUID from URL
  const router = useRouter();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  // Fetch the question by ID from server action
  useEffect(() => {
    if (!id) {
      setError("Question ID is missing from URL");
      setLoading(false);
      return;
    }

    startTransition(async () => {
      try {
        const allQuestions = await getQuestions(); // fetch all questions via server action
        const q = allQuestions.find((q) => q.id === id);
        if (!q) throw new Error("Question not found");
        setQuestion(q);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });
  }, [id]);

  // Update question using server action
  const handleUpdate = (updatedData) => {
    if (!id) return setError("Question ID is missing");

    startTransition(async () => {
      try {
        const updated = await updateQuestion({ id, ...updatedData }); // call server action
        setQuestion(updated);
        router.push("/admin/questions"); // back to list
      } catch (err) {
        setError(err.message);
      }
    });
  };

  if (loading)
    return <div className="p-8 text-gray-500">Loading question...</div>;

  if (error)
    return (
      <div className="p-8 text-red-600">
        Error: {error}
      </div>
    );

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Question</h1>

      <Questionform
        initialData={question}
        submitLabel="Update Question"
        onSubmit={handleUpdate}
        disabled={isPending}
      />
    </div>
  );
}
