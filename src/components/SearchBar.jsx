"use client";

import { Search } from "lucide-react";
import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [skill, setSkill] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");

  const handleInputChange1 = (event) => {
    setSkill(event.target.value);
  };

  const handleInputChange2 = (event) => {
    setJobTitle(event.target.value);
  };

  const handleInputChange3 = (event) => {
    setCompany(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log(skill, jobTitle, company);
    if (onSearch) {
      onSearch(skill, jobTitle, company);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex">
      <div className="flex items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="AWS"
            value={skill}
            onChange={handleInputChange1}
            className="px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none"
          />
          <label className="absolute bg-white px-2 rounded-full border top-1 left-4 transform -translate-y-3 text-gray-500 text-xs pointer-events-none">
            Skill
          </label>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Software Engineer"
            value={jobTitle}
            onChange={handleInputChange2}
            className="px-4 py-2 border border-gray-300 focus:outline-none"
          />
          <label className="absolute bg-white px-2 rounded-full border top-1 bg-half-top-gray-half-bottom-white left-4 transform -translate-y-3 text-gray-500 text-xs pointer-events-none">
            Job Title
          </label>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Google"
            value={company}
            onChange={handleInputChange3}
            className="px-4 py-2 border border-gray-300 rounded-r-full focus:outline-none"
          />
          <label className="absolute bg-white px-2 rounded-full border top-1 left-4 transform -translate-y-3 text-gray-500 text-xs pointer-events-none">
            Company
          </label>
        </div>
        <Search
          className="ml-3 w-8 h-8 p-2 bg-[#ffc800] text-gray-700 rounded-full cursor-pointer"
          onClick={handleSubmit}
        />
      </div>
    </form>
  );
};

export default SearchBar;
