"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import TestForm from "@/components/admin/TestForm";
import PublishToggle from "@/components/admin/PublishToggle";

import { useQuestionsStore } from "@/store/questionsStore";
import { useTestQuestionStore } from "@/store/testQuestionStore";
import { useTestsStore } from "@/store/useTestsStore";
import { createTest } from "@/actions/admin_B/tests.actions";
import { getQuestions } from "@/actions/admin_B/questions"; // fetch questions from server

export default function CreateTestPage() {
  const router = useRouter();
  const { questions, setQuestions } = useQuestionsStore();
  const { testQuestions, addTestQuestion, deleteTestQuestion, clearQuestions, isQuestionAdded } = useTestQuestionStore();
  const { addTest } = useTestsStore();

  const [testTitle, setTestTitle] = useState("");
  const [published, setPublished] = useState(false);

  // Fetch questions from backend if not already in store
  useEffect(() => {
    clearQuestions(); // reset previous questions
    setTestTitle("");
    setPublished(false);

    if (questions.length === 0) {
      (async () => {
        try {
          const data = await getQuestions(); // server action
          setQuestions(data); // update Zustand store
        } catch (err) {
          console.error("Failed to fetch questions:", err);
        }
      })();
    }
  }, []);

  const handleCreateTest = async () => {
    if (!testTitle) return alert("Enter a test title");
    if (testQuestions.length === 0) return alert("Add at least one question");

    try {
      const result = await createTest({
        test_name: testTitle,
        is_published: published,
        question_ids: testQuestions.map((q) => q.id),
      });

      if (!result.success) {
        alert(result.error);
        return;
      }

      addTest({
        test_id: result.data.id,
        test_name: result.data.title,
        questions: testQuestions,
        is_published: result.data.is_published,
      });

      clearQuestions();
      setTestTitle("");
      setPublished(false);

      router.push("/admin/tests");
    } catch (err) {
      console.error("Error creating test:", err);
      alert("Failed to create test");
    }
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-6 space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-semibold text-blue-900">Create Test</h1>
          <p className="text-slate-600 mt-1">Manage test details, questions and publishing status</p>
        </div>

        {/* Test Info */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium text-slate-800 mb-4">Test Information</h2>
          <TestForm testTitle={testTitle} setTestTitle={setTestTitle} />
        </div>

        {/* Selected Questions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium text-slate-900 mb-4">Selected Questions</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Points</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testQuestions.length > 0 ? (
                testQuestions.map((q) => (
                  <TableRow key={q.id} className="hover:bg-slate-50">
                    <TableCell>{q.question_text}</TableCell>
                    <TableCell>{q.section_type}</TableCell>
                    <TableCell>{q.points || 1}</TableCell>
                    <TableCell className="text-right">
                      <button className="icon-btn text-red-600" onClick={() => deleteTestQuestion(q.id)}>
                        <Trash2 size={16} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                    No questions added yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Questions Bank */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium text-slate-900 mb-4">Questions Bank</h2>
          <div className="overflow-x-auto border rounded-xl">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions.length > 0 ? (
                  questions.map((q) => (
                    <TableRow key={q.id} className="hover:bg-gray-50">
                      <TableCell className="font-mono">{q.id.slice(0, 8)}</TableCell>
                      <TableCell>{q.question_text}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                          {q.section_type}
                        </span>
                      </TableCell>
                      <TableCell>{q.points || 1}</TableCell>
                      <TableCell className="text-right">
                        <button
                          className={`icon-btn text-blue-600 ${isQuestionAdded(q.id) ? "opacity-40 cursor-not-allowed" : ""}`}
                          onClick={() => addTestQuestion(q.id)}
                          disabled={isQuestionAdded(q.id)}
                        >
                          <Plus size={16} />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                      No questions available in bank
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Publish Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium text-slate-800 mb-4">Publish Settings</h2>
          <PublishToggle published={published} setPublished={setPublished} />
        </div>

        {/* Create Test Button */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-green-200">
          <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleCreateTest}>
            Create Test
          </Button>
        </div>
      </div>
    </div>
  );
}
