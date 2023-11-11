import React, { useState, useRef, useEffect } from "react";
import { Box, Input, Text } from "@chakra-ui/react";
import FuzzySearch from "fuzzy-search";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const AutoCompleteCompanyName = ({ onSelect, defaultvalue }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const wrapperRef = useRef(null);

  const getCompanyList = async () => {
    try {
      const random = Math.floor(Math.random() * 1000000);
      const res = await axios.get(`/api/getCompanyList/${random}`);
      return res.data?.records[0]?._fields[0];
    } catch (err) {
      console.log(err);
    }
  };

  const {
    data: companies,
    isLoading: companyListLoading,
    error: companyDataError,
  } = useQuery(["companyList"], getCompanyList, {
    enabled: true,
    cacheTime: 0,
  });

  useEffect(() => {
    if (defaultvalue) {
      handleChange({ target: { value: defaultvalue } });
    }
  }, [defaultvalue, companies]);

  // const queryClient = useQueryClient();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    // queryClient.invalidateQueries(["companyList"]);
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
      const results = searcher.search("tcs");
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
          <Box width="90%" margin="0 auto" padding="8px 0">
            <Text fontSize={"sm"} fontWeight={500} color="gray.500">
              Select from the list
            </Text>
          </Box>
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
