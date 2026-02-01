"use client"
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AdminDashboard() {

  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  router.push("/");
  };

  return (
    <main className="px-6 py-8 bg-gray-50 min-h-screen">
      
      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Millionaire GRE – Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Manage GRE practice tests, questions, and student performance
          </p>
        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* TOP STATS */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Students" value="1,240" />
        <StatCard title="Practice Tests" value="12" />
        <StatCard title="Question Bank" value="3,480" />
        <StatCard title="Tests Attempted" value="8,960" />
      </section>

      {/* DIVIDER LINE */}
      <div className="my-8 border-t border-gray-200" />

      {/* LOWER SECTION */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* GRE SECTIONS */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            GRE Sections
          </h2>

          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex justify-between">
              <span>Quantitative Reasoning</span>
              <span>1,420 Questions</span>
            </li>
            <li className="flex justify-between">
              <span>Verbal Reasoning</span>
              <span>1,180 Questions</span>
            </li>
            <li className="flex justify-between">
              <span>Analytical Writing</span>
              <span>880 Prompts</span>
            </li>
          </ul>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Recent Activity
          </h2>

          <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
            <li>New full-length GRE test published</li>
            <li>120 students attempted Quant today</li>
            <li>Verbal difficulty level updated</li>
            <li>Essay evaluation criteria revised</li>
          </ul>
        </div>

      </section>

      {/* MOST POPULAR TESTS */}
      <section className="mt-8 bg-white rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-gray-700">
            Most Popular Tests
          </h2>
          <span className="text-sm text-blue-600 cursor-pointer hover:underline">
            View All →
          </span>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Ranked by total attempts
        </p>

        <ul className="space-y-4 text-sm">
          <li className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-purple-600 text-white flex items-center justify-center rounded-md font-semibold">
                1
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  JavaScript Fundamentals
                </p>
                <p className="text-xs text-gray-500">
                  Programming · 2,341 attempts · 85% avg
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-700">94%</p>
              <p className="text-xs text-gray-400">Complete</p>
            </div>
          </li>

          <li className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-md font-semibold">
                2
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  React Advanced Concepts
                </p>
                <p className="text-xs text-gray-500">
                  Framework · 1,876 attempts · 78% avg
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-700">89%</p>
              <p className="text-xs text-gray-400">Complete</p>
            </div>
          </li>

          <li className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-green-600 text-white flex items-center justify-center rounded-md font-semibold">
                3
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  Python Data Structures
                </p>
                <p className="text-xs text-gray-500">
                  Programming · 1,654 attempts · 82% avg
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-700">91%</p>
              <p className="text-xs text-gray-400">Complete</p>
            </div>
          </li>

          <li className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-orange-500 text-white flex items-center justify-center rounded-md font-semibold">
                4
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  CSS Mastery
                </p>
                <p className="text-xs text-gray-500">
                  Design · 1,432 attempts · 91% avg
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-700">96%</p>
              <p className="text-xs text-gray-400">Complete</p>
            </div>
          </li>
        </ul>
      </section>

    </main>
  );
}

/* REUSABLE CARD */
function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-lg p-5 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-2xl font-semibold text-gray-800 mt-1">
        {value}
      </h3>
    </div>
  );
}
