"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { toast } from "react-hot-toast";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const ReferralSubmit = () => {
  const [url, setUrl] = useState("");
  const [company, setCompany] = useState("");
  const [options, setOptions] = useState([]);

  // TODO: Make it run once a day
  // If using aws neptune, use lambda api gw. Check neo4j lambda example
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // Perform the scan operation
        const data = await axios.get("/api/getCompanyList");
        // console.log(data.data.records[0]._fields[0]);
        const listt = data.data.records[0]._fields[0];

        // // Extract the options from the response and update the state
        const extractedOptions = listt.map((item) => ({
          value: item,
          label: item,
        }));
        // console.log(extractedOptions);

        setOptions(extractedOptions);
      } catch (error) {
        console.error("Error fetching options from neo4j:", error);
      }
    };

    fetchOptions();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      console.log(url, company);
      // const response = await axios.post("/api/sendURL", { url, company });
      toast.success("Referral submitted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit referral");
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <div className="flex gap-x-2 items-center">
        <Input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="bg-white"
          placeholder="Enter URL"
          required
        />
        <div className="w-full">
          <Select
            options={options}
            defaultValue={company}
            placeholder="Select Company"
            onChange={setCompany}
            required
          />
        </div>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
};

export default ReferralSubmit;
