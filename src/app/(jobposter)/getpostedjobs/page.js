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
import AsyncSelect from "react-select/async";

const Page = () => {
  const fetchJobs = async () => {
    const res = await fetch("/api/getpostedjobs");
    return res.json();
  };

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

  const handleDelete = async (e) => {
    e.preventDefault();
    const res = await axios.delete("/api/deletejob");
    console.log(res);
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
                Closed
              </p>
            </div>
            <div className="mt-2">
              <h5 className="text-sm text-gray-600">
                {job._fields[0].properties.jobType}
              </h5>
              <p className="text-gray-800 mt-1">
                {job._fields[0].properties.description}
              </p>

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
                          Make changes to your profile here. Click save when
                          you're done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="jobTitle" className="text-right">
                            Job Title
                          </Label>
                          <Input id="jobTitle" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="phone" className="text-right">
                            Phone
                          </Label>
                          <Input id="phone" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="address" className="text-right">
                            Address
                          </Label>
                          <Textarea
                            placeholder="Type your address here."
                            className="w-[280px] h-[60px]"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button type="submit">Save changes</Button>
                        </DialogClose>
                      </DialogFooter>
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
