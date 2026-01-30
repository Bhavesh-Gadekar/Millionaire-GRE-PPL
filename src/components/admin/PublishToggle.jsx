"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";

export default function PublishToggle({ testId }) {
  const [published, setPublished] = useState(false);

  return (
    <div className="flex items-center justify-between">
      
      <div>
        <p className="font-medium text-slate-800">
          Publish Test
        </p>
        <p className="text-sm text-slate-500">
          Make this test visible to students
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`text-sm font-medium ${
            published ? "text-green-600" : "text-slate-400"
          }`}
        >
          {published ? "Published" : "Unpublished"}
        </span>

        <Switch
          checked={published}
          onCheckedChange={setPublished}
        />
      </div>
    </div>
  );
}
