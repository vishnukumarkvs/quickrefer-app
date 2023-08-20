"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { toast } from "react-hot-toast";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";

const ReferralSubmit = ({ options }) => {
  const { data: session, status } = useSession();
  const [url, setUrl] = useState("");
  const [company, setCompany] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://e80yu93nsk.execute-api.us-east-1.amazonaws.com/dev/referralSubmit",
        { url: url, company: company.value, targetUserId: session.user.id }
      );
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
