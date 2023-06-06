"use client";

import DatePicker from "@/components/DatePicker";
import SelectDropdown from "@/components/SelectDropdowm";
import SkillAdder from "@/components/SkillAdder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import TextAreaAutosize from "react-textarea-autosize";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JobFormSchema } from "@/lib/validations/jobform-post";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { de } from "date-fns/locale";

const experienceOptions = [
  { value: "yr", label: "in years" },
  { value: "mnth", label: "in months" },
];

const skillOptions = [
  { value: "java", label: "java" },
  { value: "python", label: "python" },
  { value: "c++", label: "c++" },
];

const salaryOptions = [
  { value: "LPA", label: "in lakhs" },
  { value: "TPA", label: "in thousands" },
];

const Page = () => {
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

  const onSubmit = (data) => {
    console.log("my data", data);
  };

  return (
    <div className="w-full h-screen bg-gray-200 flex items-center justify-center py-10">
      <div className="bg-white rounded-lg shadow-md max-w-lg mx-auto p-6">
        <p className="text-3xl font-bold my-4 text-center text-gray-700">
          Create A Job Post
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between mb-6">
            <p className="font-semibold text-lg">Job Title: </p>
            <Input
              {...register("jobTitle")}
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
              />
              <p>-</p>
              <Input
                {...register("highExp", { valueAsNumber: true })}
                className="w-16 text-center ml-2 mr-2"
                placeholder="4"
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
            <p className="font-semibold text-lg">Est Salary Range: </p>
            <div className="flex items-center">
              <Input
                {...register("baseSalary", { valueAsNumber: true })}
                className="w-16 text-center mr-2"
                placeholder="10"
              />
              <p>-</p>
              <Input
                {...register("highSalary", { valueAsNumber: true })}
                className="w-16 text-center ml-2 mr-2"
                placeholder="12"
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
//   jobTitle: 'IT operations',
//   baseExp: '6',
//   highExp: '8',
//   baseSalary: '5',
//   highSalary: '9',
//   date: Tue Jun 20 2023 00:00:00 GMT+0530 (India Standard Time) {},
//   description: 'gg',
//   skills: [
//     { value: 'linux', label: 'linux' },
//     { value: 'react', label: 'react' },
//     { value: 'cloud', label: 'cloud' }
//   ]
// }
