"use client";

import DatePicker from "@/components/DatePicker";
import SelectDropdown from "@/components/SelectDropdowm";
import SkillAdder from "@/components/SkillAdder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import TextAreaAutosize from "react-textarea-autosize";

const experienceOptions = [
  { value: "yr", label: "in years" },
  { value: "mnth", label: "in months" },
];

const salaryOptions = [
  { value: "LPA", label: "in lakhs" },
  { value: "TPA", label: "in thousands" },
];

const Page = () => {
  const textareaRef = useRef(null);

  const [defaultExperienceValue, setDefaultExperienceValue] = useState(
    experienceOptions[0].label
  );
  const [defaultSalaryValue, setDefaultSalaryValue] = useState(
    salaryOptions[0].label
  );
  const [input, setInput] = useState("");

  return (
    <div className="w-full h-screen bg-gray-200 flex items-center justify-center py-10">
      <div className="bg-white rounded-lg shadow-md max-w-lg mx-auto p-6">
        <p className="text-3xl font-bold my-4 text-center text-gray-700">
          Create A Job Post
        </p>

        <div className="flex items-center justify-between mb-6">
          <p className="font-semibold text-lg">Job Title: </p>
          <Input
            type="text"
            id="Job Title"
            placeholder="Software Developer"
            className="border-gray-300 h-10 pl-5 pr-10 rounded-lg text-sm focus:outline-none w-2/3"
          />
        </div>

        <div className="flex items-start justify-between mb-6">
          <p className="font-semibold text-lg">Skills required: </p>
          <SkillAdder className="w-2/3" />
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="font-semibold text-lg">Experience: </p>
          <div className="flex items-center">
            <Input className="w-16 text-center mr-2" placeholder="2" />
            <p>-</p>
            <Input className="w-16 text-center ml-2 mr-2" placeholder="4" />
            <SelectDropdown
              selectItems={experienceOptions}
              defaultValue={defaultExperienceValue}
              className="w-24"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="font-semibold text-lg">Est Salary Range: </p>
          <div className="flex items-center">
            <Input className="w-16 text-center mr-2" placeholder="10" />
            <p>-</p>
            <Input className="w-16 text-center ml-2 mr-2" placeholder="12" />
            <SelectDropdown
              selectItems={salaryOptions}
              defaultValue={defaultSalaryValue}
              className="w-24"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="font-semibold text-lg">Expires At: </p>
          <div className="flex items-center">
            <DatePicker />
          </div>
        </div>

        <p className="font-semibold text-lg mb-2">Description</p>
        <div className="mb-6 border rounded-lg overflow-hidden">
          <TextAreaAutosize
            onKeyDown={(e) => {
              console.log(e.key);
            }}
            minRows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="p-3 w-full resize-none border-0 bg-gray-100 text-gray-700 placeholder-gray-400 focus:ring-0 focus:outline-none sm:py-1.5 sm:text-sm sm:leading-6"
          />
        </div>

        <div className="flex justify-end">
          <Button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {}}
            type="submit"
          >
            POST
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
