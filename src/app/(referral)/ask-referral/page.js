"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";

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
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";
import { Flex } from "@chakra-ui/react";
import AsyncSelect from "react-select/async";
import AutoCompleteCompanyName from "@/components/autocomplete/CompanyNameFromNeo4J";

const Page = () => {
  const [company, setCompany] = useState(null);
  const [users, setUsers] = useState([]);
  const [url, setUrl] = useState("");
  const [fetchUsersLoading, setFetchUsersLoading] = useState(false);
  // const [allCompanies, setAllCompanies] = useState([]);

  // useEffect(() => {
  //   router.query.previous = router.asPath
  //   console.log(router.query.previous)
  // }, [])

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
          `/api/getnewreferrers?company=${selectedCompany.value}`
        );
        const usersData = response.data.records.map(
          (record) => record._fields[0].properties
        );
        if (usersData.length === 0) {
          toast(
            "No referrers found at this moment for the particular company.\n\n Try again later or please select other company",
            { position: "bottom-right", duration: 6000 }
          );
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
      setFetchUsersLoading(true);
      await getUsersOfCompany(company);
    } else {
      toast.error("Please fill both Job Link and Company fields", {
        position: "bottom-right",
      });
    }
  };

  return (
    <div className="w-full max-w-screen-lg mx-auto">
      <div className="p-4">
        <h1 className="text-5xl font-bold m-4 text-center">
          Ask for a Referral
        </h1>
        <p className="w-[70%] text-justify mx-auto my-10">
          If you want to ask for a referral for a particular job, please submit
          the job link and select the company of the posted job. We have many
          people on the platform who are willing to give referrals. Once a
          referrer wishes to give you a referral, they will contact you through
          the chat for further details.
        </p>
        {/* <ReferralSubmit options={options} /> */}
        <div className="flex flex-col max-w-xl mx-auto gap-y-4">
          <Input
            type="text"
            onChange={(e) => setUrl(e.target.value)}
            className="bg-white placeholder:text-lg placeholder:text-zinc-400"
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
            <AutoCompleteCompanyName onSelect={(val) => setCompany(val)} />
          </div>
          <div className="flex flex-col items-center">
            {/* <Button onClick={handleReferralSubmit}>Direct Submit</Button> */}
            <p className="p-5 text-center">Find people here</p>
            <Button onClick={handleFetch} isLoading={fetchUsersLoading}>
              Find
            </Button>
          </div>
        </div>
        {users.length > 0 && ( // Check if users is not empty
          <div className="my-5">
            <Table>
              <TableCaption>A list of potential referrers.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">No</TableHead>
                  <TableHead>Fullname</TableHead>
                  <TableHead>Profile</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead className="text-right">Send</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{user.fullname}</TableCell>
                    <TableCell>
                      <a
                        href={`/user/${user.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500"
                      >
                        {user.username}
                      </a>
                    </TableCell>
                    <TableCell>{user.experience} yrs</TableCell>
                    <TableCell className="text-right">
                      <AddFriendButton id={user.userId} url={url} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
