"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const EMPTY_FORM = {
  question_text: "",
  section_type: "VERBAL",
  options: ["", "", "", ""],
  correct_option: "",
};

export default function Questionform({ initialData, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!initialData) return;

    setForm({
      question_text: initialData.question_text ?? "",
      section_type: initialData.section_type ?? "VERBAL",
      options: [
        initialData.option_a ?? "",
        initialData.option_b ?? "",
        initialData.option_c ?? "",
        initialData.option_d ?? "",
      ],
      correct_option: initialData.correct_option ?? "",
    });
  }, [initialData]);

  const updateOption = (index, value) => {
    const updated = [...form.options];
    updated[index] = value;
    setForm({ ...form, options: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.question_text.trim()) return setError("Question text is required");
    if (form.section_type !== "AWA" && !form.correct_option) 
      return setError("Correct option is required");

    const payload = {
      question_text: form.question_text.trim(),
      option_a: form.options[0] || null,
      option_b: form.options[1] || null,
      option_c: form.options[2] || null,
      option_d: form.options[3] || null,
      correct_option: form.section_type === "AWA" ? null : form.correct_option,
      section_type: form.section_type,
    };

    setLoading(true);
    try {
      await onSubmit(payload); // call server API via parent
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Section */}
      <div>
        <label className="block text-sm font-medium mb-1">Section</label>
        <select
          className="input"
          value={form.section_type}
          onChange={(e) => setForm({ ...form, section_type: e.target.value })}
        >
          <option value="VERBAL">Verbal Reasoning</option>
          <option value="QUANT">Quantitative Reasoning</option>
          <option value="AWA">Analytical Writing (AWA)</option>
        </select>
      </div>

      {/* Question */}
      <div>
        <label className="block text-sm font-medium mb-1">Question</label>
        <Textarea
          value={form.question_text}
          onChange={(e) => setForm({ ...form, question_text: e.target.value })}
          placeholder="Enter question text"
          required
        />
      </div>

      {/* Options for non-AWA */}
      {form.section_type !== "AWA" && (
        <>
          <div className="grid grid-cols-1 gap-3">
            {form.options.map((opt, i) => (
              <Input
                key={i}
                value={opt}
                placeholder={`Option ${String.fromCharCode(65 + i)}`}
                onChange={(e) => updateOption(i, e.target.value)}
              />
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Correct Answer</label>
            <select
              className="input"
              value={form.correct_option}
              onChange={(e) => setForm({ ...form, correct_option: e.target.value })}
            >
              <option value="">Select correct option</option>
              {form.options.map((opt, i) => opt && <option key={i} value={opt}>{opt}</option>)}
            </select>
          </div>
        </>
      )}

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Question"}
      </Button>
    </form>
  );
}
