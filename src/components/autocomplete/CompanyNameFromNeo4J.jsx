import React, { useState, useRef, useEffect } from "react";
import { Box, Input, List, ListItem, Spinner, Text } from "@chakra-ui/react";
import { companies } from "@/constants/companies";
import FuzzySearch from "fuzzy-search";
import { Loader2 } from "lucide-react";
import { BeatLoader } from "react-spinners";

const AutoCompleteCompanyName = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const searchOptions = {
    caseSensitive: false,
    sort: true,
  };

  const handleChange = async (event) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
    setLoading(true);

    if (newQuery) {
      const res = await fetch(`/api/getCompanyList`, { cache: "no-cache" });
      // const res = await fetch(`/api/getCompanyList`, {
      //   next: { revalidate: 120 }, // in seconds
      // });
      const data = await res.json();
      const searcher = new FuzzySearch(
        data.records[0]._fields[0],
        [],
        searchOptions
      );
      setResults(searcher.search(newQuery));
      setShowResults(true);
    } else {
      setResults([]);
      setShowResults(false);
    }

    setLoading(false);
  };

  const handleSelect = (result) => {
    setQuery(result);
    setResults([]);
    setShowResults(false);
    onSelect(result);
  };

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setShowResults(false);
    }
  };

  const handleClick = () => {
    setShowResults(true);
  };

  return (
    <Box ref={wrapperRef} position="relative">
      <div className="flex flex-row items-center space-x-2">
        <Input
          bg="white"
          value={query}
          onChange={handleChange}
          placeholder="Type to search company name"
          onClick={handleClick}
        />
        {loading && <BeatLoader color="#ffc800e5" size={7} />}
      </div>

      {showResults && results?.length > 0 && (
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
      {!loading && showResults && results?.length === 0 && (
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
      )}
    </Box>
  );
};

export default AutoCompleteCompanyName;
