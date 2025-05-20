"use client";

import React, { useState } from "react";
import { Box, IconButton, useColorMode, useToast } from "@chakra-ui/react";
import { CopyIcon, CheckIcon } from "@chakra-ui/icons";

const parseTemplate = (raw: string) => {
  const lines = raw.trim().split("\n").map(line => line.trim()).filter(Boolean);
  const sections = [];
  let current: { section: string; headers: string[]; rows: string[][] } | null = null;

  for (let line of lines) {
    if (line.startsWith("@")) {
      if (current) sections.push(current);
      current = { section: line.slice(1), headers: [], rows: [] };
    } else if (current && current.headers.length === 0) {
      current.headers = line.split(",").map(h => h.trim());
    } else if (current) {
      const row = line.split(",").map(v => v.trim());
      while (row.length < current.headers.length) row.push("");
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
  const [copied, setCopied] = useState(false);
  const { colorMode } = useColorMode();
  const toast = useToast();

  const isDark = colorMode === "dark";
  const sections = parseTemplate(message);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box
      bg={isDark ? "#1a1a1a" : "#f9f9f9"}
      color={isDark ? "#f0f0f0" : "#1a1a1a"}
      p="1rem"
      borderRadius="8px"
      border={`1px solid ${isDark ? "#333" : "#ccc"}`}
    >
      {sections.map((sec, idx) => (
        <div
          key={idx}
          style={{
            background: isDark ? "#222" : "#fff",
            border: `1px solid ${isDark ? "#555" : "#ddd"}`,
            borderRadius: "6px",
            marginBottom: "1rem",
            padding: "1rem",
            overflowX: "auto",
          }}
        >
          <div
            style={{
              fontWeight: 600,
              fontSize: "16px",
              marginBottom: "0.5rem",
              color: isDark ? "#4dcfff" : "#0077cc",
              borderBottom: `1px solid ${isDark ? "#444" : "#ccc"}`,
              paddingBottom: "4px",
            }}
          >
            @{sec.section}
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {sec.headers.map((h, i) => (
                  <th
                    key={i}
                    style={{
                      border: `1px solid ${isDark ? "#444" : "#ccc"}`,
                      background: isDark ? "#333" : "#eee",
                      color: isDark ? "#fff" : "#000",
                      padding: "6px 10px",
                      fontSize: "14px",
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
                      style={{
                        border: `1px solid ${isDark ? "#444" : "#ddd"}`,
                        padding: "6px 10px",
                        fontSize: "13px",
                        color: isDark ? "#ddd" : "#333",
                      }}
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

      <IconButton
        icon={copied ? <CheckIcon /> : <CopyIcon />}
        aria-label="Copy full config"
        onClick={handleCopy}
        size="sm"
        colorScheme="blue"
        variant="outline"
        mt={2}
      />
    </Box>
  );
};

export default MessageDisplay2;
