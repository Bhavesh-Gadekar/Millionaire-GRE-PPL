"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { getDashboardStats } from "@/actions/admin_B/dashboard.actions";
import { handleLogout } from "@/actions/admin_B/auth.actions";
import {
  Users,
  FileText,
  HelpCircle,
  TrendingUp,
  Activity,
  LogOut,
  LayoutDashboard,
  Clock,
  ArrowRight
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTests: 0,
    totalQuestions: 0,
    totalAttempts: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const res = await getDashboardStats();
      if (res.success) {
        setStats(res.data);
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

  /* 
   * Updated to use Server Action for proper cookie clearing 
   * (Next.js 15/Supabase SSR requirement)
   */
  const onLogout = async () => {
    // 1. Call server action to clear HttpOnly cookies
    await handleLogout();

    // 2. Clear client-side state just in case
    await supabase.auth.signOut();

    // 3. Force hard redirect to clear client cache
    window.location.href = "/";
  };

  return (
    <div className="h-[calc(100vh-64px)] pb-6 px-6 bg-slate-50/50 flex flex-col gap-6 overflow-y-auto custom-scrollbar">

      {/* 1. Header */}
      <div className="pt-4 shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-blue-600" />
            Dashboard Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Welcome back, Admin. Here's what's happening today.
          </p>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:cursor-pointer transition-all shadow-sm"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-400 min-h-[400px]">
          <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-xs font-semibold tracking-wide">LOADING DASHBOARD</p>
        </div>
      ) : (
        <>
          {/* 2. Stat Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              title="Total Students"
              value={stats.totalStudents}
              icon={Users}
              color="blue"
              subtitle="Unique users"
            />
            <StatCard
              title="Total Tests"
              value={stats.totalTests}
              icon={FileText}
              color="indigo"
              subtitle="Published & Drafts"
            />
            <StatCard
              title="Question Bank"
              value={stats.totalQuestions}
              icon={HelpCircle}
              color="emerald"
              subtitle="Total questions"
            />
            <StatCard
              title="Test Attempts"
              value={stats.totalAttempts}
              icon={TrendingUp}
              color="violet"
              subtitle="All time"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* 3. Recent Activity Feed */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-slate-400" />
                  <h2 className="text-sm font-bold text-slate-800">Recent Activity</h2>
                </div>
                <span className="text-[10px] text-slate-400 font-medium bg-slate-50 px-2 py-0.5 rounded">Last 5 results</span>
              </div>

              <div className="p-0">
                {stats.recentActivity.length > 0 ? (
                  <div className="divide-y divide-slate-50">
                    {stats.recentActivity.map((item) => (
                      <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                            <Clock className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-700">{item.description}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{new Date(item.time).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-bold text-slate-800">{item.score} Pts</span>
                          <span className="text-[10px] text-slate-400">Score</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-400">
                    <p className="text-xs">No recent activity found.</p>
                  </div>
                )}
              </div>
            </div>

            {/* 4. Quick Actions / System Health (Placeholder for visual balance) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600">
                  <LayoutDashboard className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-slate-800">Quick Actions</h2>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => router.push('/admin/tests/create')}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group text-left hover:cursor-pointer"
                >
                  <span className="text-xs font-semibold text-slate-700">Create New Test</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-500" />
                </button>

                <button
                  onClick={() => router.push('/admin/questions/create')}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group text-left hover:cursor-pointer"
                >
                  <span className="text-xs font-semibold text-slate-700">Add Question</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-500" />
                </button>

                <button
                  onClick={() => router.push('/admin/students')}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group text-left hover:cursor-pointer"
                >
                  <span className="text-xs font-semibold text-slate-700">View Students</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-500" />
                </button>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-50">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-[10px] text-slate-500 font-medium mb-1">System Status</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-bold text-slate-700">All Systems Operational</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, subtitle }) {
  const colorStyles = {
    blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-100",
    indigo: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100",
    emerald: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100",
    violet: "bg-violet-50 text-violet-600 group-hover:bg-violet-100",
    amber: "bg-amber-50 text-amber-600 group-hover:bg-amber-100",
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between group hover:border-slate-300 transition-all">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{title}</p>
        <h3 className="text-2xl font-black text-slate-800">{value}</h3>
        <p className="text-[10px] font-medium text-slate-400 mt-1">{subtitle}</p>
      </div>
      <div className={`p-2.5 rounded-lg ${colorStyles[color]} transition-colors`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
}
