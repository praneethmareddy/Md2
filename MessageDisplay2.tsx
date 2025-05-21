"use client";

import React from "react";

const parseTemplate = (raw: string) => {
  const firstAt = raw.indexOf("@");
  if (firstAt === -1) return [];

  const content = raw.slice(firstAt);

  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const sections = [];
  let current: { section: string; headers: string[]; rows: string[][] } | null = null;

  for (let line of lines) {
    if (line.startsWith("@")) {
      if (current) sections.push(current);
      current = { section: line.slice(1).trim(), headers: [], rows: [] };
    } else if (current && current.headers.length === 0) {
      current.headers = line.split(",").map((h) => h.trim());
    } else if (current) {
      const row = line.split(",").map((v) => (v.trim() === "" ? "-" : v.trim()));
      while (row.length < current.headers.length) row.push("-");
      current.rows.push(row);
    }
  }
  if (current) sections.push(current);
  return sections;
};

interface MessageDisplayProps {
  message: string;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ message }) => {
  const sections = parseTemplate(message);

  return (
    <div style={{ background: "#111", color: "#eee", padding: "1rem", borderRadius: 8, fontFamily: "Arial" }}>
      {sections.length === 0 && <p>No sections found.</p>}

      {sections.map(({ section, headers, rows }, i) => (
        <div key={i} style={{ marginBottom: "1.5rem", padding: "1rem", background: "#222", borderRadius: 6 }}>
          <h3 style={{ color: "#4dcfff", marginBottom: "0.8rem" }}>@{section}</h3>

          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              style={{
                marginBottom: "0.6rem",
                paddingLeft: "1rem",
                borderLeft: "3px solid #4dcfff",
              }}
            >
              {headers.map((param, idx) => (
                <div key={idx} style={{ lineHeight: 1.4 }}>
                  <strong>{param || "-"}</strong>: {row[idx]}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MessageDisplay;
