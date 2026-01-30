"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function TestForm({ testId }) {
  return (
    <div className="space-y-5">
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Test Title
        </label>
        <Input
          placeholder="Enter test title"
          className="
            text-slate-900 
            placeholder:text-slate-400
            focus-visible:ring-2 
            focus-visible:ring-blue-600
          "
        />
      </div>

      

      <Button className="bg-blue-600 hover:bg-blue-700">
        Save Changes
      </Button>
    </div>
  );
}