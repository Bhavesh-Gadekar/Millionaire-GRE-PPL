"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useTestsStore } from "@/store/useTestsStore";
import { getAllTests ,deleteTestById} from "@/actions/admin_B/tests.actions";

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

    const res = await deleteTestById(id); // call Supabase directly
    if (res.success) {
      alert("Test deleted successfully");
      deleteTest(id);
      // router.refresh();
    } else {
      alert(res.error || "Failed to delete test");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">All Tests</h1>
        <Button
          onClick={() => router.push("/admin/tests/create")}
          className="text-white bg-blue-600 text-md hover:bg-blue-700 flex items-center gap-2"
        >
          <span className="text-white text-xl font-bold">+</span> Create Test
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md border border-black rounded-lg ">
        <table className="w-full table-auto text-gray-900">
          <thead>
            <tr>
              <th className=" px-6 py-3 text-sm">Test Name</th>
              <th className=" px-6 py-3 text-sm">Status</th>
              <th className="text-right px-6 py-3 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tests.length > 0 ? (
              tests.map((test) => (
                <tr
                  key={test.test_id || test.test_name}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-center">{test.test_name}</td>
                  <td className="px-6 py-4 text-sm text-center">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        test.is_published
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {test.is_published ? "Published" : "Unpublished"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm flex gap-2 justify-end">
                    <button
                      onClick={() => router.push(`/admin/tests/edit/${test.test_id}`)}
                      className="icon-btn text-blue-600"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      className="icon-btn text-red-600"
                      onClick={() => handleDelete(test.test_id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                  No tests available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
