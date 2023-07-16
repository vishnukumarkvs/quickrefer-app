"use client";

import React, { useState } from "react";
import { format, parseISO, isWithinInterval } from "date-fns";
import { Input } from "./ui/input";
import DatePickerWithRange from "./DateRangePicker";

const initialJobs = [
  { id: 1, title: "job 1", status: "Applied", appliedDate: "2023-06-01" },
  { id: 2, title: "job 2", status: "Applied", appliedDate: "2023-06-03" },
  { id: 3, title: "job 3", status: "Shortlisted", appliedDate: "2023-06-10" },
  { id: 4, title: "job 4", status: "Done", appliedDate: "2023-06-15" },
];

const ApplyKanban = () => {
  const [selectedDates, setSelectedDates] = useState(null);
  const handleDateChange = (dateRange) => {
    setSelectedDates(dateRange);
    console.log(selectedDates);
  };

  const [filter, setFilter] = useState("");
  let jobs = initialJobs.filter((job) =>
    job.title
      .replace(/\s/g, "")
      .toLowerCase()
      .includes(filter.replace(/\s/g, "").toLowerCase())
  );

  // Filter jobs based on date range if one is selected
  if (selectedDates?.from && selectedDates?.to) {
    jobs = jobs.filter((job) =>
      isWithinInterval(parseISO(job.appliedDate), {
        start: selectedDates.from,
        end: selectedDates.to,
      })
    );
  }
  return (
    <div className="w-full">
      <div className="flex p-5">
        <div className="w-full">
          <Input
            type="text"
            placeholder="Search here for any applied job ..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border border-zinc-400 rounded placeholder:italic placeholder:text-slate-500"
            style={{ width: "50%" }} // Set the width to 50% for equal width
          />
        </div>
        <div className="w-full flex items-center gap-x-2">
          <p>Filter by date:</p>
          <DatePickerWithRange onDateChange={handleDateChange} />
        </div>
      </div>
      <div className="w-full flex justify-between p-5 gap-x-2">
        {["Applied", "Viewed", "Shortlisted", "Result"].map((status) => (
          <Column
            key={status}
            status={status}
            jobs={jobs.filter((job) => job.status === status)}
          />
        ))}
      </div>
    </div>
  );
};

const Column = ({ status, jobs }) => {
  return (
    <div className="w-1/4 bg-gray-200 p-2 rounded border border-gray-300">
      <h2 className="text-lg font-bold mb-2 text-center border-b pb-1">
        {status}
      </h2>
      {jobs.map((job) => (
        <Card key={job.id} job={job} />
      ))}
    </div>
  );
};

const Card = ({ job }) => {
  return (
    <div className="bg-white p-2 rounded mb-2 border border-gray-300">
      <p className="font-semibold">{job.title}</p>
      <p className="text-xs text-gray-500">
        Applied on: {format(parseISO(job.appliedDate), "MMM dd, yyyy")}
      </p>
    </div>
  );
};
export default ApplyKanban;
