"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { useStudentTestStore } from "@/store/studentTestStore";
import { getTestQuestions } from "@/actions/student/test.actions";

export default function TestAttemptPage() {
  const { testsId } = useParams();
  const router = useRouter();
  const sections = ["VERBAL", "QUANT"];
  const questions = useStudentTestStore((s) => s.questions);
  const setQuestions = useStudentTestStore((s) => s.setQuestions);
  const [section, setSection] = useState("VERBAL");
  const [activeQ, setActiveQ] = useState(1);
  const answers = useStudentTestStore((s) => s.answers);
  const setAnswer = useStudentTestStore((s) => s.setAnswer);
  const filteredQuestions = questions.filter(
    (q) => q.section_type === section
  );

  const currentQuestion = filteredQuestions[activeQ - 1];

  const selectOption = (optionKey) => {
    setAnswer(currentQuestion.id, optionKey);
  };



  const handleNext = () => {
    if (activeQ < filteredQuestions.length) {
      setActiveQ(activeQ + 1);
    } else if (section === "VERBAL") {
      setSection("QUANT");
      setActiveQ(1);
    }
  };


  const handleSubmit = () => {
    router.push(`/tests/${testsId}/result`);
  };

  useEffect(() => {
    setActiveQ(1);
  }, [section]);

  useEffect(() => {
    async function loadQuestions() {
      const res = await getTestQuestions(testsId);
      if (!res.success) {
        alert("Failed to load questions");
        return;
      }
      setQuestions(res.data);
    }

    loadQuestions();
  }, [testsId]);


  return (
    <div className="h-screen p-4 bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-100">
      <div className="max-w-6xl mx-auto h-full flex flex-col">

        {/* Section Tabs */}
        <div className="flex space-x-4 mb-4 flex-shrink-0">
          {sections.map((sec) => (
            <button
              key={sec}
              onClick={() => {
                setSection(sec);
                setActiveQ(1);
              }}
              className={`px-6 py-2 rounded-xl font-semibold transition ${section === sec ? "bg-blue-600 text-white shadow-lg" : "bg-white text-gray-700 hover:bg-blue-50"}`}>
              {sec}
            </button>
          ))}
        </div>

        {/* Main Grid */}
        <div className="flex flex-1 gap-4 overflow-hidden">

          {/* LEFT: QUESTION CARD */}
          <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                Question {activeQ} ({section})
              </h2>

              <p className="text-sm text-gray-400 mb-4">Test ID: {testsId}</p>

              <p className="text-gray-700 mb-6 text-lg">
                {currentQuestion?.question_text}
              </p>

              <div className="space-y-4">
                {currentQuestion &&
                  [
                    { key: "A", text: currentQuestion.option_a },
                    { key: "B", text: currentQuestion.option_b },
                    { key: "C", text: currentQuestion.option_c },
                    { key: "D", text: currentQuestion.option_d },
                  ].map((opt) => {
                    const selected = answers[currentQuestion.id] === opt.key;

                    return (
                      <button
                        key={opt.key}
                        onClick={() => selectOption(opt.key)}
                        className={`w-full flex items-center justify-between rounded-xl px-6 py-3 font-medium transition-all duration-200 border border-gray-200 ${selected ? "bg-gradient-to-r from-green-100 to-green-200 text-gray-800 shadow-inner" : "bg-white hover:bg-indigo-50"}`}>
                        <span>{opt.text}</span>
                        {selected && <Check className="w-5 h-5 text-green-600" />}
                      </button>
                    );
                  })}

              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-4 flex-shrink-0">
              <button
                disabled={activeQ === 1}
                onClick={() => setActiveQ(activeQ - 1)}
                className="px-5 py-2 bg-gray-200 rounded-lg font-medium text-gray-700 disabled:opacity-50 hover:bg-gray-200 transition"
              >
                Previous
              </button>

              {section === "QUANT" && activeQ === filteredQuestions.length ? (
                <button
                  onClick={handleSubmit}
                  className="px-5 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
                >
                  Submit Test
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Next
                </button>
              )}

            </div>

          </div>

          {/* RIGHT: QUESTION NAV + STATUS PANEL */}
          <div className="flex-shrink-0 w-72 flex flex-col gap-4 h-full">

            {/* QUESTION NAV */}
            <div className="bg-white rounded-3xl p-4 shadow-lg grid grid-cols-4 gap-3 flex-shrink-0 overflow-y-auto">
              {filteredQuestions.map((q, idx) => {
                const attempted = answers[q.id];
                const isActive = activeQ === idx + 1;

                return (
                  <button
                    key={q.id}
                    onClick={() => setActiveQ(idx + 1)}
                    className={`
                    w-12 h-12 flex items-center justify-center rounded-full font-semibold transition-all duration-200
                    ${isActive
                        ? "bg-blue-100 border-2 border-blue-400 shadow-inner scale-110 text-blue-700"
                        : attempted
                          ? "bg-green-300 text-green-700 hover:bg-green-400"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-600"
                      }
                  `}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* STATUS PANEL */}
            <div className="bg-white rounded-2xl p-4 shadow-md text-sm flex flex-col space-y-2 flex-shrink-0">
              <p className="font-semibold mb-2 text-gray-700">
                Legend / Status
              </p>

              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-full bg-green-300 border border-green-400"></span>
                <span>Answered</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-full bg-gray-100 border border-gray-300"></span>
                <span>Unanswered</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-full bg-blue-100 border border-blue-400"></span>
                <span>Current</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}
