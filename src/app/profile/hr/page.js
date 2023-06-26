"use client";

import UniqueUsernameInput from "@/components/UniqueUsernameInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

const Page = () => {
  const { handleSubmit, register } = useForm();
  const [username, setUsername] = useState("");
  const [isUsernameTaken, setIsUsernameTaken] = useState(false);
  const router = useRouter();

  const handleUsernameChange = (newUsername) => {
    setUsername(newUsername);
  };

  const handleUsernameTakenChange = (newIsUsernameTaken) => {
    setIsUsernameTaken(newIsUsernameTaken);
  };

  // TODO: Add validation for username, check if username already exists or not before submitting form
  // Try to add constraints in neo4j query itself
  // TODO: update role in ddb auth table
  const onSubmit = async (data) => {
    // Handle form submission
    console.log(data);
    console.log(username);
    // console.log(isUsernameTaken);
    try {
      await axios.post("/api/newusersubmit/hr", {
        username: username,
        company: data.company,
        linkedin_profile: data.linkedin_profile,
      });
      toast.success("Profile updated successfully");
      router.push("/");
    } catch (err) {
      toast.error("Error updating profile");
      console.log(err);
    }
  };

  return (
    <div className="w-[70%] mx-auto h-screen">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div className="flex flex-row gap-x-2 items-center m-2">
            <p className="font-semibold text-lg">Username: </p>
            <UniqueUsernameInput
              onUsernameChange={handleUsernameChange}
              onUsernameTakenChange={handleUsernameTakenChange}
            />
          </div>
          <div className="flex flex-row gap-x-2 items-center m-2">
            <p className="font-semibold text-lg">Company working for: </p>
            <div>
              <Input {...register("company")} placeholder="ex: TCS" required />
            </div>
          </div>
          <div className="flex flex-row gap-x-2 items-center m-2">
            <p className="font-semibold text-lg">Your linkedin profile url: </p>
            <div>
              <Input
                {...register("linkedin_profile")}
                placeholder="ex: https://..."
                required
              />
            </div>
          </div>
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};

export default Page;
