"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function StartTestPage() {
  const { testId } = useParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startTest() {
    if (!name || !email) {
      setError("Name and email are required");
      return;
    }

    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("test_attempts")
      .insert({
        test_id: testId,
        student_name: name,
        student_email: email,
        status: "STARTED",
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Redirect student to actual test page
    router.push(`/test/${testId}?attemptId=${data.id}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow max-w-md w-full space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Start Free Test
        </h1>

        <input
          className="input"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="input"
          placeholder="Your Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <button
          onClick={startTest}
          disabled={loading}
          className="btn-blue w-full"
        >
          {loading ? "Starting..." : "Start Test"}
        </button>
      </div>
    </div>
  );
}
