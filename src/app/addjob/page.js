"use client";

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
  // const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="w-full h-screen items-center justify-center">
      <div className="max-w-lg mx-auto py-5">
        <p className="text-5xl font-bold my-2 text-center">
          {" "}
          Create A Job Post
        </p>

        <div className="flex items-center justify-start mt-10">
          <p className="font-semibold text-md pr-4">Job Title: </p>
          <Input
            type="text"
            id="Job Title"
            placeholder="Software Developer"
            className="italic flex-1 border-2 border-black-600 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none focus:border-none"
          />
        </div>

        <div className="flex items-start justify-start mt-10">
          <p className="font-semibold text-md pr-4 mt-1">Skills required: </p>
          <SkillAdder />
        </div>

        <div className="flex items-start justify-start mt-10">
          <p className="font-semibold text-md pr-4 mt-1">Experience: </p>
          <Input className="w-[4rem] text-center" placeholder="2" />
          <p className="mt-2 mx-4">-</p>
          <Input className="w-[4rem] text-center mr-2" placeholder="4" />
          <SelectDropdown
            selectItems={experienceOptions}
            defaultValue={defaultExperienceValue}
          />
        </div>
        <div className="flex items-start justify-start mt-10">
          <p className="font-semibold text-md pr-4 mt-1 flex-1">
            Est Salary Range:{" "}
          </p>
          <Input className="w-[4rem] text-center" placeholder="10" />
          <p className="mt-2 mx-4">-</p>
          <Input className="w-[4rem] text-center mr-2" placeholder="12" />
          <SelectDropdown
            selectItems={salaryOptions}
            defaultValue={defaultSalaryValue}
          />
        </div>
        {/* TextArea */}
        <p className="font-semibold mt-6">Description</p>
        <div className="pt-1 mb-2 sm:mb-0">
          <div className="relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
            <TextAreaAutosize
              onKeyDown={(e) => {
                console.log(e.key);
              }}
              minRows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="p-3 block w-full resize-none border-1 bg-transparent text-gray-900 placeholder-gray-400 focus:ring-0 focus:outline-none sm:py-1.5 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        {/* Submit */}
        <div className="flex justify-between pt-4">
          <div className="flex-shrink-0">
            <Button onClick={() => {}} type="submit">
              POST
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
