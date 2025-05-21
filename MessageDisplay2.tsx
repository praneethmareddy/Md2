"use client";

import React, { useState, useEffect } from "react";

const parseTemplate = (raw: string) => {
  console.log("Raw input:", raw);

  const lines = raw
    .trim()
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);

  console.log("Trimmed non-empty lines:", lines);

  const sections = [];
  let current: { section: string; headers: string[]; rows: string[][] } | null = null;

  for (let line of lines) {
    if (line.startsWith("@")) {
      if (current) {
        sections.push(current);
        console.log("Completed section:", current);
      }
      current = { section: line.slice(1), headers: [], rows: [] };
      console.log("New section started:", current.section);
    } else if (current && current.headers.length === 0) {
      current.headers = line.split(",").map(h => h.trim());
      console.log("Headers parsed:", current.headers);
    } else if (current) {
      const row = line.split(",").map(v => v.trim());
      while (row.length < current.headers.length) row.push(""); // pad
      current.rows.push(row);
      console.log("Row added:", row);
    }
  }

  if (current) {
    sections.push(current);
    console.log("Final section:", current);
  }

  console.log("All parsed sections:", sections);
  return sections;
};

interface MessageDisplay2Props {
  message: string;
}

const MessageDisplay2: React.FC<MessageDisplay2Props> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const [sections, setSections] = useState<
    { section: string; headers: string[]; rows: string[][] }[]
  >([]);

  useEffect(() => {
    const parsed = parseTemplate(message);
    setSections(parsed);
  }, [message]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{ background: "#111", color: "#f0f0f0", padding: "1rem", borderRadius: "8px" }}>
      {sections.length === 0 && <div>No valid sections found.</div>}

      {sections.map((sec, idx) => (
        <div key={idx} style={{ marginBottom: "2rem", border: "1px solid #444", padding: "1rem" }}>
          <h3 style={{ color: "#4dcfff", borderBottom: "1px solid #444", paddingBottom: "4px" }}>
            @{sec.section}
          </h3>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
            <thead>
              <tr>
                {sec.headers.map((h, i) => (
                  <th
                    key={i}
                    style={{
                      border: "1px solid #555",
                      background: "#222",
                      padding: "6px 10px",
                      textAlign: "left",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sec.rows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((val, cIdx) => (
                    <td
                      key={cIdx}
                      style={{ border: "1px solid #333", padding: "6px 10px", color: "#ccc" }}
                    >
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
          padding: "8px 12px",
          background: copied ? "green" : "#444",
          color: "white",
          border: "none",
          borderRadius: "4px",
        }}
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
};

export default MessageDisplay2;
