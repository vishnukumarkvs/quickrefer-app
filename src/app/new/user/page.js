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
      // update({ jtusername: username });
      // await update();
      toast.success("Profile updated successfully");
      router.push("/ask-referral");
      // router.replace("/ask-referral");
    } catch (err) {
      toast.error("Error updating profile");
      console.log(err);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex
        direction={"column"}
        gap="3"
        bg="white"
        w="40%"
        mx="auto"
        mt="50px"
        px="25px"
        py="20px"
        borderRadius={"8px"}
        boxShadow={"md"}
      >
        <Text>Full Name</Text>
        <Input
          {...register("fullname", {
            required: true,
            maxLength: 32,
            minLength: 3,
          })}
        />
        <Text>User Name</Text>
        <UniqueUsernameInput
          onUsernameChange={handleUsernameChange}
          onUsernameTakenChange={handleUsernameTakenChange}
        />
        <Text>Current/Previous Company</Text>
        <Input
          {...register("company", {
            required: true,
            maxLength: 32,
            minLength: 3,
          })}
          placeholder="ex: Google"
        />
        <Text>Your Top 3 Skills</Text>
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
        <Text>Experience</Text>
        <Input
          type="number"
          min="0"
          {...register("exp", {
            required: true,
          })}
        />
        <Text>Your Latest Resume</Text>
        <input
          type="file"
          required
          onChange={onFileChange}
          // accept=".pdf,.doc,.docx"
          accept=".pdf"
          className="flex-1 px-4 py-2 border rounded-lg  focus:outline-none focus:ring focus:border-blue-300"
        />
        <Button isLoading={isSubmitting} type="submit">
          Submit
        </Button>
      </Flex>
    </form>
  );
};
export default Page;
