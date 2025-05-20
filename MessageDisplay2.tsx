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
    container: {
      backgroundColor: "#000",
      padding: "1rem",
      color: "#fff",
      fontFamily: "Arial, sans-serif",
      borderRadius: "6px",
      border: "1px solid #444",
      overflowX: "auto" as const,
    },
    section: {
      marginBottom: "1.5rem",
      padding: "1rem",
      border: "1px solid #444",
      borderRadius: "4px",
    },
    sectionTitle: {
      fontWeight: "bold" as const,
      marginBottom: "0.5rem",
      color: "#4dcfff",
      fontSize: "16px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse" as const,
    },
    th: {
      border: "1px solid #555",
      padding: "8px",
      textAlign: "left" as const,
      backgroundColor: "#111",
      color: "#fff",
      fontSize: "14px",
    },
    td: {
      border: "1px solid #444",
      padding: "8px",
      color: "#ddd",
      fontSize: "13px",
    },
    copyButton: {
      marginTop: "1rem",
      padding: "8px 14px",
      backgroundColor: "#4dcfff",
      color: "#000",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontWeight: "bold" as const,
    },
    noData: {
      padding: "1rem",
      color: "#aaa",
      fontStyle: "italic",
    },
  };

  return (
    <div style={styles.container}>
      {sections.length === 0 ? (
        <div style={styles.noData}>No valid sections found in the message.</div>
      ) : (
        sections.map((sec, idx) => (
          <div key={idx} style={styles.section}>
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
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
};

export default MessageDisplay2;
