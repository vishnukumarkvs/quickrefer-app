"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";

const SearchResults = ({ skill, jobTitle, company, clicked }) => {
  const fetchJobs = async () => {
    const encodedJobTitle = encodeURIComponent(jobTitle);
    const encodedCompany = encodeURIComponent(company);
    const encodedSkill = encodeURIComponent(skill);

    const url = `https://3dn57btku4.execute-api.us-east-1.amazonaws.com/dev/searchByParameter?jobTitle=${encodedJobTitle}&companyName=${encodedCompany}&skillValue=${encodedSkill}`;

    try {
      const { data } = await axios.get(url);
      return data;
    } catch (error) {
      console.error("Error fetching jobs:", error);
      throw error;
    }
  };

  const { isLoading, error, data } = useQuery(
    ["jobs", { jobTitle, company, skill }],
    fetchJobs,
    {
      enabled: !!jobTitle || !!company || !!skill, // the query will not run if any of the dependencies is falsy
    }
  );

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="w-[80%] mx-auto mt-10">
      <div className="flex justify-center items-center">
        <h2>Search Results</h2>
        {/* Render the data appropriately here instead of just stringifying it */}
        <p>{JSON.stringify(data, null, 2)}</p>
      </div>
    </div>
  );
};

export default SearchResults;
