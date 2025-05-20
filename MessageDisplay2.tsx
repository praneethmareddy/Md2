import React, { useState } from "react";

interface MessageDisplay2Props {
  message: string;
}

type Section = {
  section: string;
  headers: string[];
  rows: string[][];
};

const parseTemplate = (raw: string): Section[] => {
  const lines = raw.trim().split("\n").map(line => line.trim()).filter(Boolean);
  const sections: Section[] = [];
  let current: Section | null = null;

  for (const line of lines) {
    if (line.startsWith("@")) {
      if (current) sections.push(current);
      current = { section: line.slice(1), headers: [], rows: [] };
    } else if (current && current.headers.length === 0) {
      current.headers = line.split(",").map(h => h.trim());
    } else if (current) {
      const values = line.split(",").map(v => v.trim());
      while (values.length < current.headers.length) values.push("");
      current.rows.push(values);
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
    setTimeout(() => setCopied(false), 2000);
  };

  const styles = {
    wrapper: {
      position: "relative" as const,
      width: "100%",
      padding: "1rem",
      backgroundColor: "#121212",
      borderRadius: "12px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
      color: "#ffffff",
      fontFamily: "Segoe UI, sans-serif",
    },
    section: {
      marginBottom: "1.5rem",
      backgroundColor: "#1f1f1f",
      borderRadius: "10px",
      padding: "1rem",
      border: "1px solid #333",
    },
    sectionTitle: {
      fontWeight: "600",
      color: "#4dabf7",
      fontSize: "1rem",
      marginBottom: "0.75rem",
      borderBottom: "1px solid #333",
      paddingBottom: "4px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse" as const,
      fontSize: "14px",
    },
    th: {
      padding: "8px",
      backgroundColor: "#2a2a2a",
      color: "#ffffff",
      borderBottom: "1px solid #444",
      textAlign: "left" as const,
    },
    td: {
      padding: "8px",
      borderBottom: "1px solid #333",
      color: "#eee",
    },
    copyBtn: {
      position: "absolute" as const,
      top: "1rem",
      right: "1rem",
      backgroundColor: "#4dabf7",
      color: "#fff",
      border: "none",
      padding: "8px 14px",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold" as const,
      boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
      transition: "background 0.2s ease-in-out",
    },
  };

  return (
    <div style={styles.wrapper}>
      {sections.map((sec, idx) => (
        <div key={idx} style={styles.section}>
          <div style={styles.sectionTitle}>@{sec.section}</div>
          <table style={styles.table}>
            <thead>
              <tr>
                {sec.headers.map((header, i) => (
                  <th key={i} style={styles.th}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sec.rows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} style={styles.td}>{cell || "-"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      <button onClick={handleCopy} style={styles.copyBtn}>
        {copied ? "Copied!" : "Copy"
      }</button>
    </div>
  );
};

export default MessageDisplay2;
