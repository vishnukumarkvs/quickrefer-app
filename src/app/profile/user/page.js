"use client";

import UniqueUsernameInput from "@/components/UniqueUsernameInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Controller } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import CreatableSelect from "react-select/creatable";

const skillOptions = [
  { value: "java", label: "java" },
  { value: "python", label: "python" },
  { value: "c++", label: "c++" },
];

const Page = () => {
  const router = useRouter();
  const { handleSubmit, register, errors, control } = useForm();
  const [username, setUsername] = useState("");
  const [isUsernameTaken, setIsUsernameTaken] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);

  const handleUsernameChange = (newUsername) => {
    setUsername(newUsername);
  };

  const handleUsernameTakenChange = (newIsUsernameTaken) => {
    setIsUsernameTaken(newIsUsernameTaken);
  };

  const onSubmit = async (data) => {
    // console.log(data);
    try {
      await axios.post("/api/newusersubmit/user", {
        username: username,
        company: data.company,
        isJobReferrer: data.referrer,
        skills: data.skills.map((skill) => skill.value),
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
            <p className="font-semibold text-lg">Current or last employer: </p>
            <div>
              <Input {...register("company")} placeholder="ex: TCS" />
            </div>
          </div>
          <div className="flex flex-row gap-x-2 items-center m-2">
            <p className="font-semibold text-lg">Top 3 Skills:</p>
            <Controller
              name="skills"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                validate: (value) => value && value.length <= 3,
              }} // validation rule to check for maximum 3 selected options
              render={({ field }) => (
                <CreatableSelect
                  {...field}
                  options={skillOptions}
                  isClearable
                  isSearchable
                  isMulti
                  value={selectedSkills}
                  onChange={(value) => {
                    if (value && value.length <= 3) {
                      setSelectedSkills(value);
                      field.onChange(value);
                    }
                  }}
                />
              )}
            />
          </div>
          <div className="flex flex-row gap-x-2 items-center m-2">
            <p className="font-semibold text-lg">Resume: </p>
            <div>
              <Input
                {...register("resume")}
                type="file"
                id="resume"
                className="cursor-pointer"
              />
            </div>
          </div>
          <div className="flex flex-row gap-x-2 items-center m-2">
            <p className="font-semibold text-lg">Want to be a Referrer: </p>
            <div>
              <Controller
                name="referrer"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
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
