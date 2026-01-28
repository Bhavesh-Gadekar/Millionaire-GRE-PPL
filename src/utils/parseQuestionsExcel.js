import * as XLSX from "xlsx";

export function parseQuestionsExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        if (!rows.length) {
          throw new Error("Excel file is empty");
        }

        const parsed = rows.map((row, i) => {
          const line = i + 2;

          if (!row.question_text) {
            throw new Error(`Row ${line}: question_text is required`);
          }

          const section = String(row.section_type || "VERBAL")
            .trim()
            .toUpperCase();

          if (!["VERBAL", "QUANT", "AWA"].includes(section)) {
            throw new Error(`Row ${line}: invalid section_type`);
          }

          return {
            question_text: String(row.question_text).trim(),
            section_type: section,

            option_a: row.option_a || null,
            option_b: row.option_b || null,
            option_c: row.option_c || null,
            option_d: row.option_d || null,

            correct_option:
              section === "AWA" ? null : row.correct_option || null,
          };
        });

        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    };

    reader.readAsArrayBuffer(file);
  });
}
