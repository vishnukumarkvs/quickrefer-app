"use client";

import SelectDropdown from "@/components/SelectDropdowm";
import SkillAdder from "@/components/SkillAdder";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const experienceOptions = [
  { value: "yr", label: "in years" },
  { value: "mnth", label: "in months" },
];

const salaryOptions = [
  { value: "LPA", label: "in lakhs" },
  { value: "TPA", label: "in thousands" },
];

const Page = () => {
  const [defaultExperienceValue, setDefaultExperienceValue] = useState(
    experienceOptions[0].label
  );
  const [defaultSalaryValue, setDefaultSalaryValue] = useState(
    salaryOptions[0].label
  );

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
            className="italic flex-1 border-2 border-indigo-600 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none focus:border-none"
          />
        </div>

        <div className="flex items-start justify-start mt-10">
          <p className="font-semibold text-md pr-4 mt-1">Skills required: </p>
          <SkillAdder />
        </div>

        <div className="flex items-start justify-start mt-10">
          <p className="font-semibold text-md pr-4 mt-1">Experience: </p>
          <Input className="w-[4rem]" />
          <p className="mt-2 mx-4">-</p>
          <Input className="w-[4rem] mr-2" />
          <SelectDropdown
            selectItems={experienceOptions}
            defaultValue={defaultExperienceValue}
          />
        </div>
        <div className="flex items-start justify-start mt-10">
          <p className="font-semibold text-md pr-4 mt-1 flex-1">
            Est Salary Range:{" "}
          </p>
          <Input className="w-[4rem]" />
          <p className="mt-2 mx-4">-</p>
          <Input className="w-[4rem] mr-2" />
          <SelectDropdown
            selectItems={salaryOptions}
            defaultValue={defaultSalaryValue}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
