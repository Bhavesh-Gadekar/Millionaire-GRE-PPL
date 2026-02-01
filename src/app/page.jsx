"use client";

import { useRouter } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { getPublishedTests } from "@/actions/student/test.actions";

import {
  BookOpen,
  Target,
  FileText,
  Clock,
  ArrowRight,
  Trophy,
  Users,
  Award,
  CheckCircle,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const freeTestsRef = useRef(null);
  const [freeTests, setFreeTests] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleTestClick = (testId) => {
    router.push(`/tests/${testId}/start`);
  };

  useEffect(() => {
    async function fetchTests() {
      try {
        const response = await getPublishedTests();
        if (response.success) {
          const testsWithMeta = response.data.map((test) => ({
            id: test.id,
            title: test.title,
            subtitle: "Practice Test",
            questions: 20,
            duration: "30 mins",
            difficulty: "Medium",
            icon: BookOpen,
          }));
          setFreeTests(testsWithMeta);
        } else {
          console.error("Failed to fetch tests:", response.error);
        }
      } catch (err) {
        console.error("Error fetching tests:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTests();
  }, []);

  return (
    <>
      <Navbar />

      <main className="text-gray-900">
        {/* HERO */}
        <section className="bg-indigo-700 text-white pt-13">
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="max-w-2xl space-y-6">
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                Achieve Your Best <span className="text-yellow-300">GRE Score</span>
              </h1>
              <p className="text-lg md:text-xl text-indigo-100">
                Practice GRE-style questions, take mock tests, track progress and improve your scores.
              </p>
              <button
                onClick={() =>
                  freeTestsRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  })
                }
                className="inline-block bg-yellow-300 text-indigo-900 px-8 py-3 rounded-xl font-semibold hover:bg-yellow-400 transition"
              >
                Start Free Test
              </button>
            </div>
          </div>
        </section>

        {/* FREE TESTS */}
        <section
          id="free-tests"
          ref={freeTestsRef}
          className="bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-100 border-y border-gray-300 duration-500 ease-in-out"
        >
          <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-indigo-800 mb-4">
                Start with Free Practice Tests
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Try our most popular GRE practice tests for free. No credit card required.
              </p>
            </div>

            {loading ? (
              <p className="text-center text-gray-500">Loading tests...</p>
            ) : freeTests.length === 0 ? (
              <p className="text-center text-gray-500">No free tests are available at the moment.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {freeTests.map((test) => {
                  const Icon = test.icon;
                  return (
                    <div
                      key={test.id}
                      onClick={() => handleTestClick(test.id)}
                      className="cursor-pointer group bg-white border rounded-xl p-6 hover:border-indigo-600 hover:ring-2 hover:ring-indigo-600 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                    >
                      {/* Top section: Icon + FREE badge */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Icon className="h-6 w-6 text-indigo-600" />
                        </div>
                        <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
                          FREE
                        </span>
                      </div>

                      {/* Title & Subtitle */}
                      <h3 className="text-xl font-semibold">{test.title}</h3>
                      <p className="text-gray-600 mb-4">{test.subtitle}</p>

                      {/* Questions & Duration */}
                      <div className="flex gap-4 text-sm text-gray-500 mb-6">
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {test.questions} Questions
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {test.duration}
                        </span>
                      </div>

                      {/* Bottom section: Difficulty + Start Test */}
                      <div className="flex justify-between items-center">
                        <span className="text-sm">
                          Difficulty: <strong className="text-gray-900">{test.difficulty}</strong>
                        </span>
                        <span
                          suppressHydrationWarning
                          className="flex items-center gap-2 text-indigo-600 font-medium group-hover:gap-3 transition-all"
                        >
                          Start Test <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-20 bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-100">
          <div className="max-w-7xl mx-auto px-6 text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-800">
              Why Choose MillionaireGRE?
            </h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
              Everything you need to succeed on the GRE, all in one platform.
            </p>
          </div>

          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
            <div className="bg-white rounded-xl p-8 shadow hover:shadow-xl transition cursor-pointer">
              <BookOpen className="h-8 w-8 text-indigo-600 mb-4" />
              <h3 className="font-semibold text-lg">Comprehensive Practice</h3>
              <p className="text-gray-600 mt-2">
                Full-length tests that mirror real GRE difficulty and format.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow hover:shadow-xl transition cursor-pointer">
              <Target className="h-8 w-8 text-indigo-600 mb-4" />
              <h3 className="font-semibold text-lg">Targeted Improvement</h3>
              <p className="text-gray-600 mt-2">
                Focus on weak areas with detailed performance analytics.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow hover:shadow-xl transition cursor-pointer">
              <Trophy className="h-8 w-8 text-indigo-600 mb-4" />
              <h3 className="font-semibold text-lg">Proven Results</h3>
              <p className="text-gray-600 mt-2">
                Thousands of students achieving top GRE scores every year.
              </p>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="bg-indigo-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <Users className="mx-auto mb-2 opacity-80" />
              <h3 className="text-3xl font-bold">50K+</h3>
              <p className="opacity-80 text-sm">Active Students</p>
            </div>
            <div>
              <FileText className="mx-auto mb-2 opacity-80" />
              <h3 className="text-3xl font-bold">500+</h3>
              <p className="opacity-80 text-sm">Practice Tests</p>
            </div>
            <div>
              <Award className="mx-auto mb-2 opacity-80" />
              <h3 className="text-3xl font-bold">320+</h3>
              <p className="opacity-80 text-sm">Avg Score Achieved</p>
            </div>
            <div>
              <CheckCircle className="mx-auto mb-2 opacity-80" />
              <h3 className="text-3xl font-bold">98%</h3>
              <p className="opacity-80 text-sm">Success Rate</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
