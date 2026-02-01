"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useStudentTestStore } from "@/store/studentTestStore";
import { getAttemptInfo  } from "@/actions/student/test.actions";

export default function StartTestPage() {
  const { testsId } = useParams();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const setAttemptNo = useStudentTestStore((s) => s.setAttemptNo);
  const setStudent = useStudentTestStore((s) => s.setStudent);
const setTest = useStudentTestStore((s) => s.setTest);


  const handleStartTest = async () => {
  if (!name || !email) {
    alert("Please enter your name and email");
    return;
  }

  const res = await getAttemptInfo(testsId, email);
  if (!res.success) {
    alert("Something went wrong. Please try again.");
    router.push(`/`);
    return;
  }
  if (res.attemptNo >= 2) {
  alert("Free trial ended. You have used all your attempts.");
  router.push(`/`);
  return;
}
  // allowed
  setStudent(name, email);
  setTest(testsId);
  setAttemptNo(res.attemptNo + 1);
  router.push(`/tests/${testsId}/attempt`);
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-100 px-4">
      <Card className="w-full max-w-md rounded-2xl border border-white/40 bg-white/70 backdrop-blur-xl shadow-xl">
        
        {/* Header */}
        <CardHeader className="text-center space-y-2">
          <span className="mx-auto w-fit rounded-full bg-blue-100 px-4 py-1 text-xs font-medium text-blue-700">
            Millionaire GRE · Mock Test
          </span>

          <CardTitle className="text-3xl font-semibold text-slate-800">
            Start Test
          </CardTitle>

          <p className="text-sm text-slate-500">
            Enter your details to begin the assessment
          </p>
        </CardHeader>

        {/* Content */}
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Input
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 rounded-lg bg-white/90 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500"
            />

            <Input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-lg bg-white/90 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500"
            />

            <p className="text-xs text-slate-500">
              Your email is used only for test identification.
            </p>
          </div>

          {/* Guidelines */}
          <div className="rounded-xl bg-white/80 p-4 text-sm text-slate-600 shadow-inner space-y-1">
            <p>• All questions will be shown on one page</p>
            <p>• No timer in this version</p>
            <p>• Do not refresh during the test</p>
          </div>

          {/* Button */}
          <Button
            onClick={handleStartTest}
            className="h-11 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:opacity-90 transition"
          >
            Start Test
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}