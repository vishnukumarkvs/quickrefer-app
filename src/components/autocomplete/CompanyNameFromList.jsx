import React, { useState, useRef, useEffect } from "react";
import { Box, Input, Text } from "@chakra-ui/react";
import FuzzySearch from "fuzzy-search";
import { companies } from "@/constants/companies";

const AutoCompleteCompanyName = ({
  onSelect,
  defaultvalue,
  isRequired = true,
}) => {
  const [query, setQuery] = useState(defaultvalue || "");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const searchOptions = {
    caseSensitive: false,
    sort: true,
  };

  const searcher = new FuzzySearch(Object.keys(companies), [], searchOptions);

  const handleChange = (event) => {
    const newQuery = event.target.value;
    setQuery(newQuery);

    if (newQuery) {
      const results = searcher.search(newQuery);
      setResults(results);
      setShowResults(true);
    } else {
      setResults([]);
      setShowResults(false);
    }

    // Always update the parent component with the current input value
    onSelect(newQuery);
  };

  const handleSelect = (result) => {
    setQuery(result);
    setResults([]);
    setShowResults(false);
    onSelect(result);
  };

  const handleClick = () => {
    if (query && results.length > 0) {
      setShowResults(true);
    }
  };

  return (
    <Box ref={wrapperRef} position="relative">
      <Input
        bg="white"
        value={query}
        required={isRequired}
        onChange={handleChange}
        onClick={handleClick}
      />
      {showResults && results.length > 0 && (
        <Box
          mt="2"
          width="100%"
          maxHeight="300px"
          overflowY="scroll"
          position="absolute"
          zIndex={1}
          bg="white"
          boxShadow="rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
          borderRadius="md"
        >
          {results.map((result, index) => (
            <Box
              key={index}
              onClick={() => handleSelect(result)}
              borderBottom={index < results.length - 1 ? "1px solid gray" : ""}
              width="90%"
              margin="0 auto"
              padding="8px 0"
              cursor="pointer"
            >
              <Text fontSize={"sm"} fontWeight={500}>
                {result}
              </Text>
            </Box>
          ))}
        </Box>
      )}
      {/* {!showResults && results.length === 0 && query && (
        <Box
          mt="2"
          position="absolute"
          zIndex={1}
          bg="white"
          boxShadow="sm"
          borderRadius="md"
          width="100%"
          textAlign="center"
        >
          No results found
        </Box>
      )} */}
    </Box>
  );
};

export default AutoCompleteCompanyName;
