"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";

import ReferralSubmit from "@/components/ReferralSubmit";
import { Button } from "@/components/ui/button";

const Page = () => {
  const [options, setOptions] = useState([]);
  const [company, setCompany] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const response = await axios.get("/api/getCompanyList");
      const list = response.data.records[0]._fields[0];

      const extractedOptions = list.map((item) => ({
        value: item,
        label: item,
      }));

      setOptions(extractedOptions);
    } catch (error) {
      console.error("Error fetching options from neo4j:", error);
    }
  };

  const getUsersOfCompany = async (selectedCompany) => {
    if (selectedCompany) {
      try {
        const response = await axios.post("/api/getusersofcompany", {
          company: selectedCompany.value,
        });
        const usersData = response.data.records.map(
          (record) => record._fields[0].properties
        );

        setUsers(usersData);
        console.log(users);
      } catch (error) {
        console.error("Error fetching users from company:", error);
      }
    }
  };

  const handleFetch = (event) => {
    event.preventDefault();
    getUsersOfCompany(company);
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
          our chat for further details.
        </p>
        <ReferralSubmit options={options} />
        <p className="p-5 text-center">Or find people here</p>
        <form
          className="w-[50%] mx-auto flex justify-center items-center gap-x-4"
          onSubmit={handleFetch}
        >
          <Select
            options={options}
            value={company}
            placeholder="Select Company"
            onChange={setCompany}
            isClearable
            isSearchable
            required
          />
          <Button type="submit">Fetch</Button>
        </form>
        {users.map((user, index) => (
          <div key={index} className="flex justify-around text-left">
            <p>{index + 1}.</p>
            <h2>{user.username}</h2>
            <p>{user.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
