"use client";

import React, { useState, useEffect } from "react";

const parseTemplate = (raw: string) => {
  const lines = raw
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);

  const sections = [];
  let current = null;
  let foundFirstSection = false;

  for (let line of lines) {
    if (line.startsWith("@")) {
      foundFirstSection = true;
      if (current) sections.push(current);
      current = { section: line.slice(1).trim(), headers: [], rows: [] };
    } else if (!foundFirstSection) {
      continue; // skip lines before first @section
    } else if (current && current.headers.length === 0) {
      current.headers = line.split(",").map(h => h.trim());
    } else if (current) {
      const row = line.split(",").map(v => v.trim());
      while (row.length < current.headers.length) row.push(""); // fill missing columns
      current.rows.push(row);
    }
  }

  if (current) sections.push(current);
  return sections;
};

interface MessageDisplay2Props {
  message: string;
}

const MessageDisplay2: React.FC<MessageDisplay2Props> = ({ message }) => {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const parsed = parseTemplate(message);
    setSections(parsed);
  }, [message]);

  return (
    <div style={{ background: "#111", color: "#f0f0f0", padding: "1rem" }}>
      {sections.length === 0 && <div>No valid sections found.</div>}

      {sections.map((sec, idx) => (
        <div key={idx} style={{ marginBottom: "2rem" }}>
          <h3 style={{ color: "#4dcfff", marginBottom: "0.5rem" }}>@{sec.section}</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {sec.headers.map((h, i) => (
                  <th key={i} style={{ border: "1px solid #333", padding: "6px", background: "#222" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sec.rows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((val, cIdx) => (
                    <td key={cIdx} style={{ border: "1px solid #333", padding: "6px" }}>
                      {val || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default MessageDisplay2;
