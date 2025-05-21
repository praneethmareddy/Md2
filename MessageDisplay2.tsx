"use client";

import React, { useState, useEffect } from "react";

const parseTemplate = (raw: string) => {
  const lines = raw.split("\n").map(line => line.trim());
  const sections = [];
  let current = null;
  let beforeSections = [];

  for (let line of lines) {
    if (!line) continue; // skip empty lines
    if (line.startsWith("@")) {
      if (current) sections.push(current);
      current = { section: line.slice(1), headers: [], rows: [] };
    } else if (!current) {
      beforeSections.push(line);
    } else if (current.headers.length === 0) {
      current.headers = line.split(",").map(h => h.trim());
    } else {
      const row = line.split(",").map(v => v.trim());
      while (row.length < current.headers.length) row.push("");
      current.rows.push(row);
    }
  }

  if (current) sections.push(current);
  return { beforeSections, sections };
};

interface MessageDisplay2Props {
  message: string;
}

const MessageDisplay2: React.FC<MessageDisplay2Props> = ({ message }) => {
  const [parsed, setParsed] = useState<{ beforeSections: string[]; sections: any[] }>({ beforeSections: [], sections: [] });

  useEffect(() => {
    const result = parseTemplate(message);
    console.log("Parsed result:", result);
    setParsed(result);
  }, [message]);

  return (
    <div style={{ background: "#111", color: "#eee", padding: "1rem", fontFamily: "monospace" }}>
      {parsed.beforeSections.map((line, i) => (
        <p key={i}>{line}</p>
      ))}

      {parsed.sections.map((sec, idx) => (
        <div key={idx} style={{ marginTop: "1.5rem", background: "#222", padding: "1rem", borderRadius: "8px" }}>
          <h3 style={{ color: "#4dcfff", marginBottom: "0.5rem" }}>@{sec.section}</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {sec.headers.map((h, i) => (
                  <th key={i} style={{ border: "1px solid #333", padding: "6px", background: "#333" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sec.rows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((val, cIdx) => (
                    <td key={cIdx} style={{ border: "1px solid #444", padding: "6px" }}>{val || "-"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {parsed.sections.length === 0 && (
        <p style={{ marginTop: "1rem", color: "#888" }}>No sections found.</p>
      )}
    </div>
  );
};

export default MessageDisplay2;
