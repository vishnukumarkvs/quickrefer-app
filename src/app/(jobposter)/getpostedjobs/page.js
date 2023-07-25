"use client";

import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CreatableSelect from "react-select/creatable";
import { Controller, useForm } from "react-hook-form";
import HoverToolTip from "@/components/Tooltip";

const skillOptions = [
  { value: "java", label: "java" },
  { value: "python", label: "python" },
  { value: "c++", label: "c++" },
];

const Page = () => {
  const fetchJobs = async () => {
    const res = await fetch("/api/getpostedjobs");
    return res.json();
  };

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
    setValue,
  } = useForm();

  const {
    data: jobs,
    isLoading,
    isError,
    isFetched,
  } = useQuery(["postedJobs"], fetchJobs);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loader2 className="w-8 h-8 motion-safe:animate-spin" />
      </div>
    );
  }

  if (isError) {
    return <h1>Error fetching data</h1>;
  }

  if (isFetched) {
    console.log(jobs);
  }

  const onUpdate = (data) => {
    console.log("form data", data);
  };

  return (
    <div className="w-full m-5">
      <h1 className="font-semibold text-xl mb-3">My Posted Jobs</h1>
      <div className="flex flex-wrap gap-x-2">
        {jobs.records.map((job) => (
          <div
            key={job._fields[0].properties.jobId}
            className="card mb-3 p-4 border rounded-lg shadow-md w-80"
          >
            <div className="flex justify-between">
              <h5 className="text-lg font-semibold">
                {job._fields[0].properties.jobTitle}
              </h5>
              <p
                className={`border px-6 py-1 rounded-md text-xs ${getColor(
                  "Closed"
                )}`}
              >
                {job._fields[0].properties.status}
              </p>
            </div>
            <div className="mt-2">
              <p className="text-gray-800 mt-1">
                {job._fields[0].properties.description}
              </p>
              <div className="flex flex-wrap gap-x-2 mt-4">
                {job._fields[1].map((skill) => (
                  <p className="text-white bg-black p-1 text-xs rounded-sm">
                    {skill}
                  </p>
                ))}
              </div>

              {/* Bottom right buttons */}
              <div className="flex justify-end mt-4 space-x-2">
                <div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Edit</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Job Details</DialogTitle>
                        <DialogDescription>
                          Make changes to your posted Job here. Click save when
                          you're done.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmit(onUpdate)}>
                        <div className="grid gap-2 py-4">
                          <div className="grid grid-cols-4 items-center gap-2">
                            <Label htmlFor="jobTitle" className="text-right">
                              Title
                            </Label>
                            <Input
                              {...register("jobTitle")}
                              id="jobTitle"
                              className="col-span-3"
                              defaultValue={job._fields[0].properties.jobTitle}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-2">
                            <div className="flex justify-end items-center">
                              <Label>Skills</Label>
                              <HoverToolTip
                                text={
                                  "You can only add additional skills to the existing ones."
                                }
                              />
                            </div>
                            <div className="col-span-3">
                              <Controller
                                name="skills"
                                control={control}
                                defaultValue=""
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
                          </div>
                          <div className="grid grid-cols-4 items-center gap-2">
                            <div className="flex justify-end items-center">
                              <Label>Description</Label>
                              <HoverToolTip
                                text={
                                  "After update, the new Job Description will entirely replace the old one"
                                }
                              />
                            </div>
                            <Textarea
                              {...register("jobdescription")}
                              placeholder="Update your job description here."
                              className="w-[280px] h-[60px]"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Save changes</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
                <Button className="bg-green-500">View Applied</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;

function getColor(option) {
  switch (option) {
    case "Live":
      return "text-green-500 bg-gray-100";
    case "Closed":
      return "text-red-500  bg-gray-100";
    case "On Hold":
      return "text-yellow-500 bg-gray-100";
    case "Expired":
      return "text-gray-500 bg-gray-100";
    case "Withdrawn":
      return "text-blue-500 bg-gray-100";
    case "Reopen":
      return "text-purple-500 bg-gray-100";
    default:
      return "";
  }
}
