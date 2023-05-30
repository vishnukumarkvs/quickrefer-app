"use client";

import SkillAdder from "@/components/SkillAdder";
import { Input } from "@/components/ui/input";

const Page = () => {
  return (
    <div className="w-full h-screen items-center justify-center">
      <div className="max-w-md mx-auto py-5">
        <p className="text-5xl font-bold my-2"> Create A Job Post</p>

        <div className="flex items-center justify-center mt-10">
          <p className="font-semibold text-md pr-4">Job Title: </p>
          <Input
            type="text"
            id="Job Title"
            placeholder="Software Developer"
            className="flex-1 border-2 border-indigo-600 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none focus:border-none"
          />
        </div>

        <div className="flex items-center justify-center mt-10">
          <p className="font-semibold text-md pr-4">Skills: </p>
          <SkillAdder />
        </div>
      </div>
    </div>
  );
};

export default Page;
