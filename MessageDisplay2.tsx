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
  const lines = raw.split("\n").map(line => line.trim()).filter(Boolean);
  const sections: Section[] = [];
  let current: Section | null = null;
  let parsing = false;

  for (const line of lines) {
    if (!parsing && line.includes("@")) {
      parsing = true;
    }

    if (!parsing) continue;

    const cleanLine = line.startsWith("@") ? line : line.replace(/^.*?@/, "@");

    if (cleanLine.startsWith("@")) {
      if (current) sections.push(current);
      current = { section: cleanLine.slice(1), headers: [], rows: [] };
    } else if (current && current.headers.length === 0) {
      current.headers = cleanLine.split(",").map(h => h.trim());
    } else if (current) {
      const values = cleanLine.split(",").map(v => v.trim());
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
    container: {
      backgroundColor: "#1a1a1a",
      padding: "1rem",
      color: "#f0f0f0",
      fontFamily: "Arial, sans-serif",
      borderRadius: "8px",
      border: "1px solid #333",
      overflowX: "auto" as const,
    },
    sectionBox: {
      border: "1px solid #444",
      borderRadius: "6px",
      marginBottom: "1rem",
      padding: "1rem",
      backgroundColor: "#222",
    },
    sectionTitle: {
      color: "#4dcfff",
      fontSize: "16px",
      fontWeight: 600,
      borderBottom: "1px solid #555",
      marginBottom: "0.75rem",
      paddingBottom: "0.25rem",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse" as const,
    },
    th: {
      backgroundColor: "#333",
      color: "#fff",
      padding: "6px 10px",
      border: "1px solid #555",
      textAlign: "left" as const,
      fontSize: "14px",
    },
    td: {
      border: "1px solid #444",
      padding: "6px 10px",
      fontSize: "13px",
      color: "#ddd",
    },
    copyButton: {
      marginTop: "1rem",
      padding: "8px 16px",
      backgroundColor: "#4dcfff",
      color: "#000",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontWeight: 600,
    },
    noData: {
      color: "#aaa",
      fontStyle: "italic",
      padding: "1rem",
    },
  };

  return (
    <div style={styles.container}>
      {sections.length === 0 ? (
        <div style={styles.noData}>No valid sections found in the message.</div>
      ) : (
        sections.map((sec, idx) => (
          <div key={idx} style={styles.sectionBox}>
            <div style={styles.sectionTitle}>@{sec.section}</div>
            <table style={styles.table}>
              <thead>
                <tr>
                  {sec.headers.map((h, i) => (
                    <th key={i} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sec.rows.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.map((val, cIdx) => (
                      <td key={cIdx} style={styles.td}>{val || "-"}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
      <button onClick={handleCopy} style={styles.copyButton}>
        {copied ? "Copied!" : "Copy Configuration"
      }</button>
    </div>
  );
};

export default MessageDisplay2;
