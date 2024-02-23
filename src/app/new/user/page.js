"use client";

import UniqueUsernameInput from "@/components/UniqueUsernameInput";
import { useForm } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Controller } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import CreatableSelect from "react-select/creatable";
import { useSession } from "next-auth/react";
import { Flex, Text, Input, Button } from "@chakra-ui/react";
import AutoCompleteCompanyName from "@/components/autocomplete/CompanyNameFromList";

// const resume_api_url = process.env.NEXT_PUBLIC_RESUME_UPLOAD_URL;

// if (!resume_api_url) {
//   console.error("API URL is not defined.");
// }

const skillOptions = [
  { value: "java", label: "java" },
  { value: "python", label: "python" },
  { value: "c++", label: "c++" },
];

const Page = () => {
  const { data: session, update } = useSession();
  const router = useRouter();
  const {
    handleSubmit,
    register,
    errors,
    control,
    setValue,
    formState: { isSubmitting },
  } = useForm();
  const [username, setUsername] = useState("");
  const [isUsernameTaken, setIsUsernameTaken] = useState(true);
  // const [selectedSkills, setSelectedSkills] = useState([]);

  const isSubmitDisabled = username === "" || isUsernameTaken;

  const handleUsernameChange = (newUsername) => {
    newUsername = newUsername.toLowerCase();
    newUsername = newUsername.trim().replace(/\s+/g, "-");
    setUsername(newUsername);
  };

  const handleUsernameTakenChange = (newIsUsernameTaken) => {
    setIsUsernameTaken(newIsUsernameTaken);
  };

  const onSubmit = async (data) => {
    if (data.exp == 0) {
      data.exp = "1";
    }
    try {
      await axios.post("/api/newusersubmit/user", {
        username: username,
        jobrole: data.jobrole || "Software Engineer",
        company: data.company || "Others",
        // skills: data.skills.map((skill) => skill.value),
        exp: data.exp || "1",
      });
      update({ jtusername: username, userNew: false });
      toast.success(
        "Profile updated successfully, all the best for your job search"
      );
      router.push("/ask-referral");
    } catch (err) {
      toast.error("Error updating profile");
      console.log(err);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Text
        fontSize={"lg"}
        fontWeight={500}
        textAlign={"center"}
        py="5"
        px="2"
        bg="#ffc800e5"
      >
        Complete Your Profile - Lets Get Started!
      </Text>
      <Flex
        direction={"column"}
        gap="3"
        bg="white"
        w={{ base: "90%", lg: "40%" }}
        mx="auto"
        mt="50px"
        px="25px"
        py="20px"
        borderRadius={"8px"}
        boxShadow={"md"}
      >
        <div>
          <Text fontSize={"sm"} fontWeight={500}>
            Username
          </Text>
          <UniqueUsernameInput
            onUsernameChange={handleUsernameChange}
            onUsernameTakenChange={handleUsernameTakenChange}
          />
        </div>
        <div>
          {/* <Text fontSize={"sm"} fontWeight={500}>
            Current/Previous Company
          </Text> */}
          <div className="mb-2">
            <p className="font-medium text-sm">Current/Previous Company</p>
            {/* <p className="text-xs font-normal">(Freshers can write: Others)</p> */}
          </div>
          {/* <Input
          {...register("company", {
            required: true,
            maxLength: 32,
            minLength: 3,
          })}
          placeholder="ex: Google"
        /> */}
          <AutoCompleteCompanyName
            onSelect={(val) => {
              setValue("company", val);
            }}
            isRequired={false}
          />
        </div>
        {/* <Text>Your Top 3 Skills</Text>
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
        /> */}
        <div>
          <Text fontSize={"sm"} fontWeight={500}>
            Job Role
          </Text>
          <Input
            {...register("jobrole", {
              required: false,
              maxLength: 32,
              minLength: 3,
            })}
          />
        </div>
        <div>
          <Text fontSize={"sm"} fontWeight={500}>
            Experience
          </Text>
          <Input
            type="number"
            min="0"
            {...register("exp", {
              required: false,
            })}
          />
        </div>
        {/* <Text>Your Latest Resume</Text>
        <input
          type="file"
          required
          onChange={onFileChange}
          // accept=".pdf,.doc,.docx"
          accept=".pdf"
          className="flex-1 px-4 py-2 border rounded-lg  focus:outline-none focus:ring focus:border-blue-300"
        /> */}
        <Button
          isLoading={isSubmitting}
          isDisabled={isSubmitDisabled}
          type="submit"
          className="mt-4"
        >
          Submit
        </Button>
      </Flex>
    </form>
  );
};
export default Page;
