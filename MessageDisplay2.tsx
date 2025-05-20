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
    },
    card: {
      border: "1px solid #ccc",
      borderRadius: "8px",
      marginBottom: "1rem",
      padding: "1rem",
      backgroundColor: "#f9f9f9",
      overflowX: "auto" as const,
    },
    sectionTitle: {
      fontWeight: "bold" as const,
      color: "#0070f3",
      marginBottom: "8px",
      paddingBottom: "4px",
      borderBottom: "1px solid #ddd",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse" as const,
      fontSize: "14px",
    },
    th: {
      padding: "6px",
      textAlign: "left" as const,
      backgroundColor: "#eee",
      borderBottom: "1px solid #ddd",
    },
    td: {
      padding: "6px",
      textAlign: "left" as const,
      borderBottom: "1px solid #eee",
    },
    copyBtn: {
      position: "absolute" as const,
      top: "0",
      right: "0",
      backgroundColor: "#0070f3",
      color: "#fff",
      border: "none",
      padding: "6px 10px",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "12px",
    },
  };

  return (
    <div style={styles.wrapper}>
      {sections.map((sec, idx) => (
        <div key={idx} style={styles.card}>
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
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
};

export default MessageDisplay2;
