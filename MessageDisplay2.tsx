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
  IconButton,
  useColorMode,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { CopyIcon, CheckIcon } from "@chakra-ui/icons";

// Section type
type Section = {
  section: string;
  headers: string[];
  rows: string[][];
};

// Props type
interface MessageDisplay2Props {
  message: string;
}

// Template parser
const parseTemplate = (raw: string): Section[] => {
  const lines = raw.trim().split("\n").map(line => line.trim()).filter(Boolean);
  const sections: Section[] = [];
  let current: Section | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
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
  const { colorMode } = useColorMode();
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  const cardBg = useColorModeValue("white", "gray.700");
  const tableHeaderBg = useColorModeValue("gray.50", "gray.600");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const scrollThumb = useColorModeValue("gray.300", "gray.500");

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    toast({
      title: "Configuration copied!",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "bottom",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const sections = parseTemplate(message);

  return (
    <Box position="relative" w="full">
      <Box _hover={{ ".copy-config-btn": { display: "inline-flex" } }} position="relative">
        <VStack align="stretch" spacing={3} pt={2} pb={1}>
          {sections.map((sec, idx) => (
            <Box
              key={idx}
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="lg"
              p={3}
              bg={cardBg}
              boxShadow="base"
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
                pb={1}
                borderBottom="1px solid"
                borderColor={borderColor}
              >
                @{sec.section}
              </Text>

              <Table variant="simple" size="sm" w="full">
                <Thead bg={tableHeaderBg}>
                  <Tr>
                    {sec.headers.map((h, i) => (
                      <Th key={i} fontSize="xs" py={1}>
                        {h}
                      </Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {sec.rows.map((row, rIdx) => (
                    <Tr key={rIdx}>
                      {row.map((val, cIdx) => (
                        <Td key={cIdx} fontSize="xs" py={1}>
                          {val || "-"}
                        </Td>
                      ))}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          ))}
        </VStack>

        <IconButton
          icon={copied ? <CheckIcon /> : <CopyIcon />}
          aria-label="Copy config"
          size="sm"
          variant="ghost"
          colorScheme="blue"
          className="copy-config-btn"
          position="absolute"
          top="-10px"
          right="-8px"
          display="none"
          _hover={{ transform: "scale(1.1)" }}
          onClick={handleCopy}
        />
      </Box>
    </Box>
  );
};

export default MessageDisplay2;
