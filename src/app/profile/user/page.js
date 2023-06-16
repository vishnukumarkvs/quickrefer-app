"use client";

import UniqueUsernameInput from "@/components/UniqueUsernameInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

const Page = () => {
  const { handleSubmit, register, errors } = useForm();
  const onSubmit = (data) => console.log(data);
  return (
    <div className="w-[70%] mx-auto h-screen">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div className="flex flex-row gap-x-2 items-center m-2">
            <p className="font-semibold text-lg">Username: </p>
            <UniqueUsernameInput />
          </div>
          <div className="flex flex-row gap-x-2 items-center m-2">
            <p className="font-semibold text-lg">Current or last employer: </p>
            <div>
              <Input {...register("company")} placeholder="ex: TCS" />
            </div>
          </div>
          <div className="flex flex-row gap-x-2 items-center m-2">
            <p className="font-semibold text-lg">Resume: </p>
            <div>
              <Input {...register("resume")} type="file" id="resume" />
            </div>
          </div>
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};
export default Page;
