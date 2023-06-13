"use client";

import DatePicker from "@/components/DatePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import TextAreaAutosize from "react-textarea-autosize";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JobFormSchema } from "@/lib/validations/jobform-post";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { options } from "@/assets/location-options";
import AsyncSelect from "react-select/async";
import { useSession } from "next-auth/react";

const filterColors = (inputValue) => {
  return options.filter((i) =>
    i.label.toLowerCase().includes(inputValue.toLowerCase())
  );
};

const loadOptions = (inputValue, callback) => {
  setTimeout(() => {
    callback(filterColors(inputValue));
  }, 1000);
};

const experienceOptions = [
  { value: "YR", label: "in years" },
  { value: "MNTH", label: "in months" },
];

const skillOptions = [
  { value: "java", label: "java" },
  { value: "python", label: "python" },
  { value: "c++", label: "c++" },
];

const salaryOptions = [
  { value: "LPA", label: "lakhs per year" },
  { value: "DPA", label: "dollars per year" },
];

const defaultLocationOptions = [
  { value: "Bangalore, India", label: "Bangalore, India" },
  { value: "Mumbai, India", label: "Mumbai, India" },
  { value: "Delhi, India", label: "Delhi, India" },
  { value: "Chennai, India", label: "Chennai, India" },
  { value: "Hyderabad, India", label: "Hyderabad, India" },
  { value: "Kolkata, India", label: "Kolkata, India" },
  { value: "Pune, India", label: "Pune, India" },
  { value: "Ahmedabad, India", label: "Ahmedabad, India" },
  { value: "Noida, India", label: "Noida, India" },
  { value: "Gurgaon, India", label: "Gurgaon, India" },
];

const Page = () => {
  const { data: session, status } = useSession();

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(JobFormSchema),
  });

  const [defaultExperienceValue, setDefaultExperienceValue] = useState(
    experienceOptions[0]
  );
  const [defaultSalaryValue, setDefaultSalaryValue] = useState(
    salaryOptions[0]
  );
  const [input, setInput] = useState("");

  const postJobMutation = useMutation((payload) => {
    const apiUrl =
      "https://3dn57btku4.execute-api.us-east-1.amazonaws.com/dev/postjob";
    return axios.post(apiUrl, payload);
  });

  const onSubmit = async (submitted_data) => {
    const skills = submitted_data.skills.map((skill) =>
      skill.value.toLowerCase()
    );
    const experienceUnit = submitted_data.experienceUnit.value;
    const salaryUnit = submitted_data.salaryUnit.value;
    const {
      skills: _,
      experienceUnit: __,
      salaryUnit: ___,
      ...restData
    } = submitted_data;

    const payload = {
      skills: skills,
      experienceUnit: experienceUnit,
      salaryUnit: salaryUnit,
      restData: restData,
    };

    postJobMutation.mutate(payload, {
      onSuccess: (data) => {
        toast.success("Job posted successfully");
        console.log("post neo4j data", data);
      },
      onError: () => {
        toast.error("Some error occured. please submit again");
      },
    });
  };

  return (
    <div className="w-full h-screen bg-gray-200 flex items-center justify-center py-10">
      <div className="bg-white rounded-lg shadow-md max-w-lg mx-auto p-6">
        <p className="text-3xl font-bold my-4 text-center text-gray-700">
          Create A Job Post
        </p>
        <p>{JSON.stringify(session)}</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between mb-6">
            <p className="font-semibold text-lg">Job Title: </p>
            <Input
              {...register("jobTitle")}
              required
              type="text"
              id="Job Title"
              placeholder="Software Developer"
              className="border-gray-300 h-10 pl-5 pr-10 rounded-lg text-sm focus:outline-none w-2/3"
            />
          </div>

          <div className="flex items-start justify-between mb-6">
            <p className="font-semibold text-lg">Skills required: </p>
            {/* <SkillAdder control={control} name="skills" className="w-2/3" /> */}
            <Controller
              name="skills"
              control={control}
              defaultValue=""
              rules={{ required: true }} // optional validation rule
              render={({ field }) => (
                <CreatableSelect
                  {...field}
                  options={skillOptions}
                  isClearable
                  isSearchable
                  isMulti
                  required
                />
              )}
            />
          </div>

          <div className="flex items-center justify-between mb-6">
            <p className="font-semibold text-lg">Experience: </p>
            <div className="flex items-center">
              <Input
                {...register("baseExp", { valueAsNumber: true })}
                className="w-16 text-center mr-2"
                placeholder="2"
                required
              />
              <p>-</p>
              <Input
                {...register("highExp", { valueAsNumber: true })}
                className="w-16 text-center ml-2 mr-2"
                placeholder="4"
                required
              />
              {/* <SelectDropdown
                name="expUnit"
                control={control}
                selectItems={experienceOptions}
                defaultValue={defaultExperienceValue}
                className="w-24"
              /> */}
              <Controller
                name="experienceUnit"
                control={control}
                defaultValue={defaultExperienceValue}
                rules={{ required: true }} // optional validation rule
                render={({ field }) => (
                  <Select
                    {...field}
                    defaultValue={defaultExperienceValue}
                    options={experienceOptions}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <p className="font-semibold text-lg mr-2">Est Salary Range: </p>
            <div className="flex items-center">
              <Input
                {...register("baseSalary", { valueAsNumber: true })}
                className="w-16 text-center mr-2"
                placeholder="10"
                required
              />
              <p>-</p>
              <Input
                {...register("highSalary", { valueAsNumber: true })}
                className="w-16 text-center ml-2 mr-2"
                placeholder="12"
                required
              />
              <Controller
                name="salaryUnit"
                control={control}
                defaultValue={defaultSalaryValue}
                rules={{ required: true }} // optional validation rule
                render={({ field }) => (
                  <Select
                    {...field}
                    defaultValue={defaultSalaryValue}
                    options={salaryOptions}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <p className="font-semibold text-lg mr-2">Location: </p>
            <div className="w-[60%]">
              <Controller
                name="locations"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field }) => (
                  <div className="w-full">
                    <AsyncSelect
                      {...field}
                      placeholder="Search..."
                      loadOptions={loadOptions}
                      defaultOptions={defaultLocationOptions}
                      isClearable
                      isSearchable
                      isMulti
                      required
                    />
                  </div>
                )}
              />
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <p className="font-semibold text-lg">Expires At: </p>
            <div className="flex items-center">
              <DatePicker control={control} name="date" />
            </div>
          </div>

          <p className="font-semibold text-lg mb-2">Description</p>
          <div className="mb-6 border rounded-lg overflow-hidden">
            <TextAreaAutosize
              {...register("description")}
              required
              minRows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="p-3 w-full resize-none border-0 bg-gray-100 text-gray-700 placeholder-gray-400 focus:ring-0 focus:outline-none sm:py-1.5 sm:text-sm sm:leading-6"
            />
          </div>

          <div className="flex justify-end">
            <div className="flex-grow">
              {Object.keys(errors).map((field) => (
                <p key={field} className="text-red-500">
                  {field}: {errors[field]?.message}
                </p>
              ))}
            </div>
            <Button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              isLoading={postJobMutation.isLoading}
              type="submit"
            >
              POST
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;

// current form output
// {
//   "baseExp": 1,
//   "baseSalary": 1,
//   "date": "Thu Jun 29 2023 00:00:00 GMT+0530 (India Standard Time)",
//   "description": "1111",
//   "experienceUnit": {
//     "value": "mnth",
//     "label": "in months"
//   },
//   "highExp": 1,
//   "highSalary": 1,
//   "jobTitle": "www",
//   "salaryUnit": {
//     "value": "LPA",
//     "label": "in lakhs"
//   },
//   "skills": [
//     {
//       "value": "python",
//       "label": "python"
//     },
//     {
//       "value": "hyy",
//       "label": "hyy"
//     },
//     {
//       "value": "sgak",
//       "label": "sgak"
//     }
//   ]
// }
