import React, { useState, useRef, useEffect } from "react";
import { Box, Input, Text } from "@chakra-ui/react";
import FuzzySearch from "fuzzy-search";
import axios from "axios";

const AutoCompleteCompanyName = ({ onSelect, defaultvalue }) => {
  const [query, setQuery] = useState(defaultvalue || "");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const wrapperRef = useRef(null);
  const [companies, setCompanies] = useState([]);
  const [companyListLoading, setCompanyListLoading] = useState(false);

  useEffect(() => {
    setCompanyListLoading(true);
    axios
      .get("/api/getCompanyList")
      .then((res) => {
        setCompanyListLoading(false);
        setCompanies(res.data?.records[0]?._fields[0]);
      })
      .catch((err) => {
        setCompanyListLoading(false);
        console.log(err);
      });
  }, []);

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

  const searcher = new FuzzySearch(companies, [], searchOptions);

  const handleChange = (event) => {
    const newQuery = event.target.value;
    setQuery(newQuery);

    if (newQuery) {
      const results = searcher.search(newQuery);
      console.log("results", results, searcher);
      setResults(results);
      setShowResults(true);
    } else {
      setResults([]);
      setShowResults(false);
    }
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
        required
        placeholder={
          companyListLoading
            ? "Fetching company list..."
            : "Search for a company"
        }
        onChange={handleChange}
        onClick={handleClick}
        disabled={companyListLoading}
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
