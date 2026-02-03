"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Pencil, Trash2, Plus, FileText } from "lucide-react";
import { useTestsStore } from "@/store/useTestsStore";
import { getAllTests, deleteTestById } from "@/actions/admin_B/tests.actions";

export default function TestsPage() {
  const router = useRouter();
  const { tests, addTest, deleteTest } = useTestsStore();

  useEffect(() => {
    const fetchTests = async () => {
      const result = await getAllTests();
      if (result.success && result.data) {
        useTestsStore.getState().setTests(
          result.data.map((t) => ({
            test_id: t.id,
            test_name: t.title,
            is_published: t.is_published,
          }))
        );
      }
    };

    fetchTests();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this test?")) return;

    const res = await deleteTestById(id);
    if (res.success) {
      deleteTest(id);
    } else {
      alert(res.error || "Failed to delete test");
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] pb-3 px-6 bg-slate-50/50 flex flex-col gap-3">

      {/* 1. Header & Create Action */}
      <div className="flex items-center justify-between shrink-0 pt-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Tests Management
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold border border-blue-200">
              {tests.length} Tests
            </span>
          </div>
        </div>

        <button
          onClick={() => router.push("/admin/tests/create")}
          className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-bold text-xs border border-transparent hover:cursor-pointer"
        >
          <Plus size={16} />
          Create Test
        </button>
      </div>

      {/* 2. Tests Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-1 min-h-0 relative">
        <div className="overflow-y-auto flex-1 p-0 custom-scrollbar">
          <table className="w-full relative border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10 shadow-sm">
              <tr className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-3 bg-slate-50">Test Name</th>
                <th className="px-6 py-3 bg-slate-50 w-32 text-center">Status</th>
                <th className="px-6 py-3 text-right bg-slate-50 w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tests.length > 0 ? (
                tests.map((test) => (
                  <tr
                    key={test.test_id || test.test_name}
                    className="hover:bg-blue-50/50 transition-colors group"
                  >
                    <td className="px-6 py-2.5">
                      <p className="text-xs font-medium text-slate-800 group-hover:text-blue-900">
                        {test.test_name}
                      </p>
                    </td>
                    <td className="px-6 py-2.5 text-center">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-md border ${test.is_published
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-amber-50 text-amber-700 border-amber-100"
                          }`}
                      >
                        {test.is_published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-2.5">
                      <div className="flex justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => router.push(`/admin/tests/edit/${test.test_id}`)}
                          className="p-1.5 bg-white text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-slate-200 hover:border-blue-600"
                          title="Edit"
                        >
                          <Pencil size={14} strokeWidth={2.5} />
                        </button>
                        <button
                          onClick={() => handleDelete(test.test_id)}
                          className="p-1.5 bg-white text-red-600 rounded-md hover:bg-red-600 hover:text-white transition-all shadow-sm border border-slate-200 hover:border-red-600"
                          title="Delete"
                        >
                          <Trash2 size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3 border border-blue-100 shadow-sm">
                      <Plus className="w-6 h-6 text-blue-400" />
                    </div>
                    <p className="text-xs font-medium">No tests available</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
