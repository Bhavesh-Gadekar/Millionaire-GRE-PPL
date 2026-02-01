"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { handleAdminLogin } from "@/actions/admin_B/auth.actions";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLoginClick = async () => {
    setLoading(true);
    setError("");

    const { success, message } = await handleAdminLogin(email, password);

    if (!success) {
      setError(message);
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6 text-center">
            Admin Login
          </h2>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {error && <p className="text-sm text-red-500 mt-3 text-center">{error}</p>}

          <button
            onClick={handleLoginClick}
            disabled={loading}
            className="w-full mt-6 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </main>

      <footer className="py-4 text-center text-sm text-slate-500">
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> Millionaire GRE • All rights reserved
      </footer>
    </div>
  );
}
