"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
// import Select from "react-select";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import AddFriendButton from "@/components/chat/AddFriendButton";

import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";
import { Flex, Input } from "@chakra-ui/react";
// import AsyncSelect from "react-select/async";
import AutoCompleteCompanyName from "@/components/autocomplete/CompanyNameFromNeo4J";
import EmptyComponent from "@/components/emptystates/EmptyComponent";
import { handleShareClick, isValidURL } from "@/lib/utils";
import UserList from "@/components/ask-referral/UserList";
import analytics from "@/lib/analytics";
import ShareButton from "@/components/ShareButton";

const Page = () => {
  const [company, setCompany] = useState(null);
  const [users, setUsers] = useState(null);
  const [url, setUrl] = useState("");
  const [fetchUsersLoading, setFetchUsersLoading] = useState(false);
  // const [allCompanies, setAllCompanies] = useState([]);

  // useEffect(() => {
  //   router.query.previous = router.asPath
  //   console.log(router.query.previous)
  // }, [])

  useEffect(() => {
    if (localStorage) {
      console.log(localStorage);
      setUrl(localStorage.getItem("joburl"));
      setCompany(localStorage.getItem("company"));
    }
  }, []);

  const loadOptions = async (inputValue, callback) => {
    try {
      const response = await axios.get("/api/getCompanyList");
      const list = response.data.records[0]._fields[0];

      const extractedOptions = list.map((item) => ({
        value: item,
        label: item,
      }));

      const filteredOptions = extractedOptions.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );

      callback(filteredOptions);
    } catch (error) {
      console.error("Error fetching companies from neo4j:", error);
    }
  };

  const getUsersOfCompany = async (selectedCompany) => {
    if (selectedCompany) {
      try {
        const response = await axios.get(
          `/api/getnewreferrers?company=${selectedCompany}`
        );
        const usersData = response.data.records.map(
          (record) => record._fields[0].properties
        );
        if (usersData.length === 0) {
          // toast(
          //   "No referrers found at this moment for the particular company.\n\n Try again later or please select other company",
          //   { position: "bottom-right", duration: 6000 }
          // );
        }
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users from company:", error);
      } finally {
        setFetchUsersLoading(false);
      }
    }
  };

  const handleFetch = async (event) => {
    event.preventDefault();
    if (company && url) {
      if (!isValidURL(url)) {
        toast.error("Please enter a valid URL", {
          position: "bottom-right",
        });
        return;
      }
      setFetchUsersLoading(true);
      await getUsersOfCompany(company);
      localStorage.removeItem("joburl");
      localStorage.removeItem("company");
    } else {
      toast.error("Please fill both Job Link and Company fields", {
        position: "bottom-right",
      });
    }
  };

  useEffect(() => {
    analytics.page();
  }, []);

  return (
    <div className="w-full max-w-screen-lg mx-auto">
      <div className="p-4">
        <h1 className="text-5xl font-bold m-4 text-center">
          Ask for a Referral
        </h1>
        <p className="w-full lg:w-[70%] mx-auto my-10 text-center">
          Submit the job link and choose the company for the referral. <br />{" "}
          Referrers interested in helping will connect with you via chat for
          details.
        </p>
        {/* <ReferralSubmit options={options} /> */}
        <div className="flex flex-col max-w-xl mx-auto gap-y-4">
          <Input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-white"
            placeholder="Enter Job Link"
            required
          />
          <div className="w-full">
            {/* <AsyncSelect
              // defaultOptions={defaultAsyncOptions}
              loadOptions={loadOptions} // Use the loadOptions function to fetch options asynchronously
              cacheOptions
              placeholder="Type Company Name"
              onChange={setCompany}
              noOptionsMessage={() => "No companies found"}
              isSearchable
              isClearable
              required
            /> */}
            <AutoCompleteCompanyName
              defaultvalue={company}
              onSelect={(val) => setCompany(val)}
            />
          </div>
          <div className="flex justify-center items-center gap-2">
            {/* <Button onClick={handleReferralSubmit}>Direct Submit</Button> */}
            <Button
              className="bg-[#ffc800e5] hover:bg-[#ffc800] text-black"
              onClick={handleFetch}
              isLoading={fetchUsersLoading}
            >
              Search
            </Button>
            <Button
              onClick={() => {
                handleShareClick(
                  `Job Search for ${company}`,
                  `Hey, I found this job in ${company} and I think you can get referrers here.`,
                  `https://quickrefer.in/search?company=${company}&joburl=${encodeURIComponent(
                    url
                  )}`
                );
              }}
            >
              Share job search
            </Button>
          </div>
        </div>
        <UserList users={users} company={company} url={url} />
        <div className="my-4">
          <ShareButton />
        </div>
      </div>
    </div>
  );
};

export default Page;
