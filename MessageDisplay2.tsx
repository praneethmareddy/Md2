// components/MessageDisplay2.tsx
import React, { useState } from "react";
import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
  Stack,
  IconButton,
  useColorMode,
  useToast,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
import { CopyIcon, CheckIcon } from "@chakra-ui/icons";

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

const MessageDisplay2 = ({ message }: { message: string }) => {
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const bgColor = useColorModeValue("white", "gray.700");
  const headerBg = useColorModeValue("gray.50", "gray.600");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const scrollThumb = useColorModeValue("gray.300", "gray.500");

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    toast({
      title: "Configuration copied",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "bottom-right",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const sections = parseTemplate(message);

  return (
    <Box position="relative" w="full">
      <VStack spacing={4} align="stretch">
        {sections.length === 0 ? (
          <Text color="gray.500" fontStyle="italic">No sections found.</Text>
        ) : (
          sections.map((sec, idx) => (
            <Box
              key={idx}
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="lg"
              p={4}
              bg={bgColor}
              boxShadow="md"
              overflowX="auto"
              sx={{
                "&::-webkit-scrollbar": {
                  height: "6px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: scrollThumb,
                  borderRadius: "10px",
                },
              }}
            >
              <Text
                fontSize="sm"
                fontWeight="semibold"
                color="blue.400"
                mb={2}
                borderBottom="1px solid"
                borderColor={borderColor}
                pb={1}
              >
                @{sec.section}
              </Text>

              {sec.headers.length > 0 && sec.rows.length > 0 ? (
                <Table variant="simple" size="sm" w="full">
                  <Thead bg={headerBg}>
                    <Tr>
                      {sec.headers.map((h, i) => (
                        <Th key={i} fontSize="xs" py={1}>{h}</Th>
                      ))}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {sec.rows.map((row, rIdx) => (
                      <Tr key={rIdx}>
                        {row.map((val, cIdx) => (
                          <Td key={cIdx} fontSize="xs" py={1}>{val || "-"}</Td>
                        ))}
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              ) : (
                <Stack spacing={1}>
                  {sec.rows.flat().map((line, i) => (
                    <Text fontSize="sm" key={i}>{line}</Text>
                  ))}
                </Stack>
              )}
            </Box>
          ))
        )}
        <Box textAlign="right">
          <IconButton
            aria-label="Copy message"
            icon={copied ? <CheckIcon /> : <CopyIcon />}
            colorScheme="blue"
            size="sm"
            onClick={handleCopy}
          />
        </Box>
      </VStack>
    </Box>
  );
};

export default MessageDisplay2;
