"use client";

import React, { useState } from "react";

interface MessageDisplay2Props {
  message: string;
}

interface Section {
  section: string;
  headers: string[];
  rows: string[][];
}

const parseTemplate = (raw: string): Section[] => {
  const lines = raw.trim().split("\n").map(line => line.trim()).filter(Boolean);
  const sections: Section[] = [];
  let current: Section | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!line.startsWith("@") && !current) continue; // skip leading non-template text

    if (line.startsWith("@")) {
      if (current) sections.push(current);
      current = { section: line.slice(1), headers: [], rows: [] };
    } else if (current && current.headers.length === 0) {
      current.headers = line.split(",").map(v => v.trim());
    } else if (current) {
      const row = line.split(",").map(v => v.trim());
      while (row.length < current.headers.length) row.push("");
      current.rows.push(row);
    }
  }

  if (current) sections.push(current);
  return sections;
};

const MessageDisplay2: React.FC<MessageDisplay2Props> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const sections = parseTemplate(message);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{ backgroundColor: "#1a1a1a", color: "#f0f0f0", padding: "1rem", borderRadius: "8px", fontFamily: "sans-serif" }}>
      {sections.map((sec, idx) => (
        <div key={idx} style={{ background: "#222", border: "1px solid #555", borderRadius: "6px", marginBottom: "2rem", padding: "1rem" }}>
          <h3 style={{ color: "#4dcfff", fontSize: "18px", marginBottom: "10px", borderBottom: "1px solid #444", paddingBottom: "4px" }}>
            @{sec.section}
          </h3>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {sec.headers.map((header, i) => (
                  <th key={i} style={{ border: "1px solid #444", padding: "8px", background: "#333", color: "#fff", textAlign: "left" }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sec.rows.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  {row.map((val, colIdx) => (
                    <td key={colIdx} style={{ border: "1px solid #444", padding: "8px", color: "#ddd" }}>
                      {val || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <button
        onClick={handleCopy}
        style={{
          backgroundColor: copied ? "#2ecc71" : "#0077cc",
          color: "#fff",
          border: "none",
          padding: "6px 12px",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
};

export default MessageDisplay2;
