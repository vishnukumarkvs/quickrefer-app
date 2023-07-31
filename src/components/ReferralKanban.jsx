"use client";

import React, { useState, useMemo } from "react";
import { format, parseISO, isWithinInterval } from "date-fns";
import axios from "axios";
import { Input } from "./ui/input";
import DatePickerWithRange from "./DateRangePicker";
import { useQuery } from "@tanstack/react-query";

const fetchReferralRequests = async () => {
  const response = await axios.get("/api/getreferralrequests");
  return processData(response.data.records[0]._fields);
};

const processData = (records) => {
  const transformRecord = (record, status) => ({
    id: record.user.properties.userId,
    title: `${record.user.properties.fullname} (${record.user.properties.userRole})`,
    status,
    appliedDate: new Date().toISOString().substring(0, 10),
    worksAt: record.company
      ? record.company.properties.name
      : "Unknown Company",
  });

  const sentFriendRequests = records[0]
    .filter((record) => record.user !== null)
    .map((record) => transformRecord(record, "Requested"));

  const friends = records[1]
    .filter((record) => record.user !== null)
    .map((record) => transformRecord(record, "Available for Chat"));

  return { sentFriendRequests, friends };
};

const ReferralKanban = () => {
  const [selectedDates, setSelectedDates] = useState(null);
  const [filter, setFilter] = useState("");

  const {
    isLoading,
    isError,
    data: userData,
    error,
  } = useQuery({
    queryKey: "referralRequests",
    queryFn: fetchReferralRequests,
  });

  const handleDateChange = (dateRange) => {
    setSelectedDates(dateRange);
  };

  const requests = useMemo(() => {
    if (userData) {
      let temp = [...userData.sentFriendRequests, ...userData.friends];

      temp = temp.filter((job) =>
        (job.title + " " + job.worksAt)
          .replace(/\s/g, "")
          .toLowerCase()
          .includes(filter.replace(/\s/g, "").toLowerCase())
      );

      if (selectedDates?.from && selectedDates?.to) {
        temp = temp.filter((job) =>
          isWithinInterval(parseISO(job.appliedDate), {
            start: selectedDates.from,
            end: selectedDates.to,
          })
        );
      }

      return temp;
    } else {
      return [];
    }
  }, [userData, filter, selectedDates]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="w-full">
      <div className="flex p-5">
        <div className="w-full">
          <Input
            type="text"
            placeholder="Search here for any applied job or company ..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border border-zinc-400 rounded placeholder:italic placeholder:text-slate-500"
            style={{ width: "50%" }}
          />
        </div>
        <div className="w-full flex items-center gap-x-2">
          <p>Filter by date:</p>
          <DatePickerWithRange onDateChange={handleDateChange} />
        </div>
      </div>
      <div className="w-full flex justify-around p-5 gap-x-4">
        {["Requested", "Available for Chat"].map((status) => (
          <Column
            key={status}
            status={status}
            requests={requests.filter((job) => job.status === status)}
          />
        ))}
      </div>
    </div>
  );
};

const Column = React.memo(({ status, requests }) => {
  return (
    <div className="w-1/3 bg-gray-200 p-2 rounded border border-gray-300">
      <h2 className="text-lg font-bold mb-2 text-center border-b pb-1">
        {status}
      </h2>
      {requests.map((job) => (
        <Card key={job.id} job={job} />
      ))}
    </div>
  );
});

const Card = React.memo(({ job }) => {
  return (
    <div className="bg-white p-2 rounded mb-2 border border-gray-300">
      <p className="font-semibold">{job.title}</p>
      <p className="text-xs text-gray-500">Works at: {job.worksAt}</p>
      <p className="text-xs text-gray-500">
        Applied on: {format(parseISO(job.appliedDate), "MMM dd, yyyy")}
      </p>
    </div>
  );
});

export default ReferralKanban;
