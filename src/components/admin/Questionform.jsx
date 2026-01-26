"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

/* ---------------- DB-ALIGNED FORM ----------------
DB columns:
id, question_text, option_a, option_b, option_c, option_d,
correct_option, section_type, created_at
-------------------------------------------------- */
const EMPTY_FORM = {
  question_text: "",
  section_type: "VERBAL", // VERBAL | QUANT | AWA
  options: ["", "", "", ""],
  correct_option: "",
};

export default function Questionform({ initialData, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);

  /* -------- LOAD EDIT DATA -------- */
  useEffect(() => {
    if (!initialData) {
      setForm(EMPTY_FORM);
      return;
    }

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

  /* -------- OPTION HANDLER -------- */
  const updateOption = (index, value) => {
    const updated = [...form.options];
    updated[index] = value;
    setForm({ ...form, options: updated });
  };

  /* -------- SUBMIT -------- */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.question_text.trim()) {
      alert("Question text is required");
      return;
    }

    if (form.section_type !== "AWA" && !form.correct_option) {
      alert("Correct option is required");
      return;
    }

    const payload = {
      question_text: form.question_text.trim(),
      section_type: form.section_type,

      option_a: form.options[0] || null,
      option_b: form.options[1] || null,
      option_c: form.options[2] || null,
      option_d: form.options[3] || null,

      correct_option:
        form.section_type === "AWA" ? null : form.correct_option,
    };

    onSubmit(payload);
  };

  /* -------- UI -------- */
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">

      {/* SECTION TYPE */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Section
        </label>
        <select
          className="input"
          value={form.section_type}
          onChange={(e) =>
            setForm({ ...form, section_type: e.target.value })
          }
        >
          <option value="VERBAL">Verbal Reasoning</option>
          <option value="QUANT">Quantitative Reasoning</option>
          <option value="AWA">Analytical Writing (AWA)</option>
        </select>
      </div>

      {/* QUESTION TEXT */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Question
        </label>
        <Textarea
          placeholder="Enter question text"
          value={form.question_text}
          onChange={(e) =>
            setForm({ ...form, question_text: e.target.value })
          }
          required
        />
      </div>

      {/* OPTIONS (NOT FOR AWA) */}
      {form.section_type !== "AWA" && (
        <>
          <div className="grid grid-cols-1 gap-3">
            {form.options.map((opt, i) => (
              <Input
                key={i}
                placeholder={`Option ${String.fromCharCode(65 + i)}`}
                value={opt}
                onChange={(e) =>
                  updateOption(i, e.target.value)
                }
              />
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Correct Answer
            </label>
            <select
              className="input"
              value={form.correct_option}
              onChange={(e) =>
                setForm({ ...form, correct_option: e.target.value })
              }
            >
              <option value="">Select correct option</option>
              {form.options.map(
                (opt, i) =>
                  opt && (
                    <option key={i} value={opt}>
                      {opt}
                    </option>
                  )
              )}
            </select>
          </div>
        </>
      )}

      <Button type="submit">
        Save Question
      </Button>
    </form>
  );
}
