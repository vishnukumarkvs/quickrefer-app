"use client";

import React, { useState, useMemo } from "react";
import {
  format,
  parseISO,
  isWithinInterval,
  formatDistance,
  subDays,
} from "date-fns";
import axios from "axios";
import DatePickerWithRange from "./DateRangePicker";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Text,
  Heading,
  Tag,
} from "@chakra-ui/react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  Input,
} from "@chakra-ui/react";
import PageLoader from "./PageLoader";
import Link from "next/link";

const fetchReferralRequests = async () => {
  const response = await axios.get("/api/getreferralrequests");
  console.log(response.data.records[0]._fields);
  return processData(response.data.records[0]._fields);
};

const processData = (records) => {
  const transformRecord = (record, status) => ({
    id: record.user.properties.userId,
    fullname: record.user.properties.fullname,
    username: record.user.properties.username,
    job_url: record.job_url || null,
    status,
    appliedDate: record.applied_on
      ? new Date(
          record.applied_on.year.low,
          record.applied_on.month.low - 1,
          record.applied_on.day.low,
          record.applied_on.hour.low,
          record.applied_on.minute.low,
          record.applied_on.second.low,
          record.applied_on.nanosecond.low / 1000000 // Convert nanoseconds to milliseconds
        )
          .toISOString()
          .substring(0, 10)
      : null, // Return null if applied_on property is not available
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
    queryKey: ["referralRequests"],
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

  console.log(requests, "rrr");

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Flex direction="column" gap="7" p="5">
      <Flex gap="2">
        <Input
          type="text"
          placeholder="Search here for any applied job or company ..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          bg="white"
          boxShadow="md"
          borderRadius="md"
          border="none"
          style={{ width: "50%" }}
        />
        <DatePickerWithRange onDateChange={handleDateChange} />
      </Flex>
      <Tabs>
        <TabList>
          <Tab>Referrals Applied</Tab>
          <Tab>Got Referred</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Flex direction={"column"} gap="5">
              {requests.map((job, idx) => (
                <Card key={idx} variant={"elevated"} p="4">
                  <Flex justifyContent={"space-between"}>
                    <Flex direction={"column"} gap="2">
                      <Text fontSize={"xl"} fontWeight={"bold"}>
                        {job.worksAt}
                      </Text>
                      <Text>
                        Referrer:{" "}
                        <Link
                          href={`http://localhost:3000/user/${job.username}`}
                          target="_blank"
                          className="text-blue-500"
                        >
                          {job.fullname}
                        </Link>
                      </Text>
                      <Text>
                        Job URL:{" "}
                        <Link
                          href={job.job_url}
                          target="_blank"
                          className="text-blue-500"
                        >
                          {job.job_url}
                        </Link>
                      </Text>
                    </Flex>
                    <Flex
                      direction={"column"}
                      gap="5"
                      borderLeft={"1px solid black"}
                      px="4"
                    >
                      <Text fontSize={"xl"} letterSpacing={2}>
                        Applied on
                      </Text>
                      <Tag>
                        {format(new Date(job.appliedDate), "dd MMM yyyy")} (
                        {formatDistance(new Date(job.appliedDate), new Date(), {
                          addSuffix: true,
                        })}
                        )
                      </Tag>
                    </Flex>
                  </Flex>
                </Card>
              ))}
            </Flex>
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default ReferralKanban;
