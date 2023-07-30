"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";

import ReferralSubmit from "@/components/ReferralSubmit";
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
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

const Page = () => {
  const { data: session, status } = useSession();

  const [options, setOptions] = useState([]);
  const [company, setCompany] = useState(null);
  const [users, setUsers] = useState([]);
  const [url, setUrl] = useState("");
  const [fetchUsersLoading, setFetchUsersLoading] = useState(false);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const response = await axios.get("/api/getCompanyList"); // Corrected API endpoint
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
        const response = await axios.get(
          `/api/getnewreferrers?company=${selectedCompany.value}`
        );
        const usersData = response.data.records.map(
          (record) => record._fields[0].properties
        );
        console.log(usersData);
        if (usersData.length === 0) {
          toast(
            "No referrers found at this moment for the particular company.\n\n Try again later or select other company",
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

  const submitReferral = async (url, company, userId) => {
    try {
      console.log(url, company);
      const response = await axios.post(
        "https://e80yu93nsk.execute-api.us-east-1.amazonaws.com/dev/referralSubmit",
        { url: url, company: company.value, targetUserId: userId }
      );
      toast.success("Referral submitted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit referral");
    }
  };

  const handleFetch = async (event) => {
    event.preventDefault();
    if (company) {
      setFetchUsersLoading(true);
      await getUsersOfCompany(company);
    } else {
      toast.error("Please select a company", { position: "top-right" });
    }
    console.log(users);
  };

  const handleReferralSubmit = async () => {
    if (!company || !url) {
      toast.error("Please enter Job URL and also select company", {
        position: "top-right",
      });
      return;
    }
    await submitReferral(url, company, session.user.id);
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
            className="bg-white"
            placeholder="Enter URL"
            required
          />
          <div className="w-full">
            <Select
              options={options}
              placeholder="Select Company"
              onChange={setCompany}
              isSearchable
              isClearable
              required
            />
          </div>
          <div className="flex flex-col items-center">
            <Button onClick={handleReferralSubmit}>Direct Submit</Button>
            <p className="p-5 text-center">Or find people here</p>
            <Button onClick={handleFetch} isLoading={fetchUsersLoading}>
              Fetch
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
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Send</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="text-right">
                      <AddFriendButton id={user.userId} />
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
