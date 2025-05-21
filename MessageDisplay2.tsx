"use client";

import React, { useState, useEffect } from "react";

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

interface MessageDisplay2Props {
  message: string;
}

const MessageDisplay2: React.FC<MessageDisplay2Props> = ({ message }) => {
  const [sections, setSections] = useState<
    { section: string; headers: string[]; rows: string[][] }[]
  >([]);

  useEffect(() => {
    setSections(parseTemplate(message));
  }, [message]);

  return (
    <div
      style={{
        background: "#111",
        color: "#f0f0f0",
        padding: "1rem",
        borderRadius: "8px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {sections.length === 0 && <div>No valid sections found.</div>}

      {sections.map((sec, idx) => (
        <div
          key={idx}
          style={{
            marginBottom: "2rem",
            border: "1px solid #444",
            borderRadius: "6px",
            padding: "1rem",
            background: "#222",
          }}
        >
          <h3
            style={{
              color: "#4dcfff",
              borderBottom: "1px solid #444",
              paddingBottom: "4px",
              marginBottom: "1rem",
            }}
          >
            @{sec.section}
          </h3>

          {sec.rows.map((row, rIdx) => (
            <div
              key={rIdx}
              style={{
                marginBottom: "0.75rem",
                paddingLeft: "1rem",
              }}
            >
              {sec.headers.map((header, hIdx) => (
                <div
                  key={hIdx}
                  style={{
                    display: "flex",
                    gap: "1rem",
                    fontSize: "14px",
                    color: row[hIdx] === "-" ? "#777" : "#ddd",
                    fontStyle: row[hIdx] === "-" ? "italic" : "normal",
                  }}
                >
                  <strong style={{ minWidth: "100px" }}>{header}:</strong>
                  <span>{row[hIdx]}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MessageDisplay2;
