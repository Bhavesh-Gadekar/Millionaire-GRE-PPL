"use client";

import { useEffect, useState } from "react";
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
import { useParams, useRouter } from "next/navigation";
import TestForm from "@/components/admin/TestForm";
import PublishToggle from "@/components/admin/PublishToggle";
import { gettTestById, updateTest } from "@/actions/admin_B/tests.actions";
import { getQuestions } from "@/actions/admin_B/questions"; // server action

export default function EditTestPage() {
  const { id } = useParams();
  const router = useRouter();

  // Local state instead of Zustand
  const [questions, setQuestions] = useState([]); // question bank from Supabase
  const [testTitle, setTestTitle] = useState("");
  const [published, setPublished] = useState(false);
  const [testQuestions, setTestQuestions] = useState([]);

  // Fetch test and questions from Supabase
  useEffect(() => {
    async function fetchData() {
      // fetch test
      const testRes = await gettTestById(id);
      if (testRes.success) {
        const test = testRes.data;
        setTestTitle(test.title);
        setPublished(test.is_published);

        // fetch questions from Supabase
        const questionBank = await getQuestions();
        setQuestions(questionBank);

        // map test questions to full objects
        const fullQuestions = test.questions.map((q) =>
          questionBank.find((bankQ) => bankQ.id === q.id) || q
        );
        setTestQuestions(fullQuestions);
      } else {
        alert(testRes.error);
      }
    }

    fetchData();
  }, [id]);

  const addTestQuestion = (qId) => {
    if (testQuestions.find((q) => q.id === qId)) return;
    const question = questions.find((q) => q.id === qId);
    if (!question) return;
    setTestQuestions([...testQuestions, question]);
  };

  const deleteTestQuestion = (qId) => {
    setTestQuestions(testQuestions.filter((q) => q.id !== qId));
  };

  const isQuestionAdded = (qId) => testQuestions.some((q) => q.id === qId);

  const handleUpdateTest = async () => {
    if (!testTitle) return alert("Enter test title");
    if (testQuestions.length === 0) return alert("Add at least one question");

    const res = await updateTest(id, {
      title: testTitle,
      is_published: published,
      question_ids: testQuestions.map((q) => q.id),
    });

    if (res.success) {
      alert("Test updated successfully");
      router.push("/admin/tests");
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-6 space-y-8">

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-semibold text-blue-900">Edit Test</h1>
          <p className="text-slate-600 mt-1">
            Manage test details, questions and publishing status
          </p>
        </div>

        {/* Test Info */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium text-slate-800 mb-4">
            Test Information
          </h2>
          <TestForm testTitle={testTitle} setTestTitle={setTestTitle} />
        </div>

        {/* Test Questions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-slate-900">Questions</h2>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Marks</TableHead>
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
                      <button
                        className="icon-btn text-red-600"
                        onClick={() => deleteTestQuestion(q.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    No questions added to this test yet
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
                {questions.map((q) => (
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
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Publish Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium text-slate-800 mb-4">Publish Settings</h2>
          <PublishToggle published={published} setPublished={setPublished} />
        </div>

        {/* Save Changes */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-200">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleUpdateTest}>
            Save Changes
          </Button>
        </div>

      </div>
    </div>
  );
}
