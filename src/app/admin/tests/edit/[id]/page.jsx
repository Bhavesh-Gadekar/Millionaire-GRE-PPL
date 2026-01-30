// export default function EditTestPage({ params }) {
//   return <div>Edit Test ID: {params.id}</div>;
// }
"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useParams } from "next/navigation";
import TestForm from "@/components/admin/TestForm";
import PublishToggle from "@/components/admin/PublishToggle";

export default function EditTestPage() {
  const { id } = useParams();

  return (
    <div className="flex-1 bg-slate-50 min-h-screen">
      {/* Width controller */}
      <div className="max-w-5xl mx-auto px-6 py-6 space-y-8">

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-semibold text-blue-900">
            Edit Test
          </h1>
          <p className="text-slate-600 mt-1">
            Manage test details, questions and publishing status
          </p>
        </div>

        {/* Test Info */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium text-slate-800 mb-4">
            Test Information
          </h2>
          <TestForm testId={id} />
        </div>

        {/* Questions Section */} 
        <div className="bg-white rounded-xl shadow-sm p-6"> 
          <div className="flex items-center justify-between mb-4"> 
            <h2 className="text-lg font-medium text-slate-900"> Questions 
              </h2> 
              <Button className=" bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all duration-200 "onClick={() => console.log("Add Question clicked")} > + Add Question
                 </Button> 
                 </div> 
                 <Table>
                   <TableHeader> 
                    <TableRow> 
                      <TableHead className="w-10">
                        </TableHead> 
                        <TableHead className="text-slate-700 font-medium"> Question 
                          </TableHead> 
                          <TableHead className="text-slate-700 font-medium"> Type 
                            </TableHead> 
                            <TableHead className="text-slate-700 font-medium"> Marks
                               </TableHead> 
                               <TableHead className="text-right text-slate-700 font-medium"> Actions 
                                </TableHead> 
                                </TableRow>
                                 </TableHeader> 
                                 <TableBody> 
                                  {/* Row 1 */} 
                                  <TableRow className="hover:bg-slate-50"> 
                                    <TableCell> <input type="checkbox" /> </TableCell> 
                                    <TableCell className="text-slate-900"> Sample question one? 
                                      </TableCell> <TableCell className="text-slate-900"> MCQ
                                         </TableCell>
                                          <TableCell className="text-slate-900"> 10 
                                            </TableCell> 
                                            <TableCell className="text-right space-x-2"> 
                                              <Button size="sm" className=" bg-blue-500 text-white hover:bg-blue-600 transition-colors 
                                              "onClick={() => console.log("Edit clicked")} > Edit 
                                              </Button> 
                                              <Button size="sm" className=" bg-red-500 text-white hover:bg-red-600 transition-colors 
                                              "onClick={() => alert("Delete functionality will be added later")} > Delete
                                               </Button>
                                                </TableCell> 
                                                </TableRow>
                                                 {/* Row 2 */} 
                                                 <TableRow className="hover:bg-slate-50"> 
                                                  <TableCell> <input type="checkbox" />
                                                   </TableCell> <TableCell className="text-slate-900"> Sample question two? 
                                                    </TableCell> 
                                                    <TableCell className="text-slate-900"> MCQ </TableCell>
                                                     <TableCell className="text-slate-900"> 5 </TableCell>
                                                      <TableCell className="text-right space-x-2"> 
                                                        <Button size="sm" className=" bg-blue-500 text-white hover:bg-blue-600 transition-colors 
                                                        "onClick={() => console.log("Edit clicked")} > Edit 
                                                        </Button> 
                                                        <Button size="sm" className=" bg-red-500 text-white hover:bg-red-600 transition-colors 
                                                        "onClick={() => alert("Delete functionality will be added later")} > Delete 
                                                        </Button> 
                                                        </TableCell> 
                                                        </TableRow>
                                                         </TableBody> 
                                                         </Table> 
                                                         </div>

        {/* Publish Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium text-slate-800 mb-4">
            Publish Settings
          </h2>
          <PublishToggle testId={id} />
        </div>

        {/* 🔴 Danger Zone (DELETE TEST) */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-red-200">
          <h2 className="text-lg font-semibold text-red-600 mb-2">
            Delete Test
          </h2>

          <p className="text-sm text-slate-600 mb-4">
            Deleting this test is permanent. All questions and attempts
            associated with this test will be lost.
          </p>

          <Button
            className="
              bg-red-600 text-white
              hover:bg-red-700
              hover:shadow-md
              transition-all duration-200
              active:scale-95
            "
            onClick={() => {
              const confirmDelete = confirm(
                "Are you sure you want to delete this test? This action cannot be undone."
              );
              if (confirmDelete) {
                console.log("Delete test:", id);
              }
            }}
          >
            Delete Test
          </Button>
        </div>

      </div>
    </div>
  );
}
