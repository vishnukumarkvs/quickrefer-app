"use client";

import { useState } from "react";

import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";

const Homepage = () => {
  const [searchData, setSearchData] = useState({
    skill: "",
    jobTitle: "",
    company: "",
  });
  const [clicked, setClicked] = useState(false);

  const handleSearch = (skill, jobTitle, company) => {
    setSearchData({ skill, jobTitle, company });
    setClicked(!clicked);
  };

  return (
    <div className="w-full">
      <div>
        <SearchBar onSearch={handleSearch} />
        <SearchResults
          skill={searchData.skill}
          jobTitle={searchData.jobTitle}
          company={searchData.company}
          clicked={clicked}
        />
      </div>
    </div>
  );
};

export default Homepage;
