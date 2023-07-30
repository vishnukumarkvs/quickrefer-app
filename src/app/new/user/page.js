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
import { useSession } from "next-auth/react";

const skillOptions = [
  { value: "java", label: "java" },
  { value: "python", label: "python" },
  { value: "c++", label: "c++" },
];

const Page = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const {
    handleSubmit,
    register,
    errors,
    control,
    formState: { isSubmitting },
  } = useForm();
  const [username, setUsername] = useState("");
  const [isUsernameTaken, setIsUsernameTaken] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
    setFileName(event.target.files[0].name);
  };

  const onFileUpload = async () => {
    try {
      const reader = new FileReader();

      reader.onload = async () => {
        const base64File = reader.result.split(",")[1];
        const fileExtension = file.name.split(".").pop();
        console.log("session user id", session.user.id);

        // Send the data
        const response = await axios.put(
          "https://s9u8bu61y6.execute-api.us-east-1.amazonaws.com/dev/upload", // Replace with your API Gateway URL
          {
            fileData: base64File,
            userId: session.user.id, // Replace with your user ID
          },
          {
            headers: {
              "file-extension": fileExtension,
              "Content-Type": "application/json",
            },
          }
        );

        console.log(response.data);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUsernameChange = (newUsername) => {
    setUsername(newUsername);
  };

  const handleUsernameTakenChange = (newIsUsernameTaken) => {
    setIsUsernameTaken(newIsUsernameTaken);
  };

  const onSubmit = async (data) => {
    // console.log(data);
    if (file) {
      await onFileUpload(); // Upload the file before form submission
    }
    try {
      await axios.post("/api/newusersubmit/user", {
        username: username,
        fullname: data.fullname,
        company: data.company,
        skills: data.skills.map((skill) => skill.value),
        exp: data.exp,
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
            <p className="font-semibold text-lg">Full Name: </p>
            <div>
              <Input {...register("fullname")} />
            </div>
          </div>
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
            <div className="flex flex-row gap-x-2 items-center m-2">
              <p className="font-semibold text-lg">Experience: </p>
              <div>
                <Input {...register("exp")} />
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-x-2 items-center m-2">
            <p className="font-semibold text-lg">Resume:</p>
            <div className="bg-white rounded-lg shadow-md">
              <input
                type="file"
                onChange={onFileChange}
                className="flex-1 px-4 py-2 border rounded-lg shadow-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
          </div>
        </div>
        <Button type="submit" isLoading={isSubmitting}>
          Submit
        </Button>
      </form>
    </div>
  );
};
export default Page;
