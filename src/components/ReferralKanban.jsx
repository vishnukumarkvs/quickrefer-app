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
              {[
                {
                  title: "Company name",
                  url: "https://www.google.com",
                  referrer: "sankar kumar",
                  date: new Date(),
                },
              ].map((job, idx) => (
                <Card key={idx} variant={"elevated"} p="4">
                  <Flex justifyContent={"space-between"}>
                    <Flex direction={"column"} gap="2">
                      <Text fontSize={"xl"} fontWeight={"bold"}>
                        {job.title}
                      </Text>
                      <Text>
                        Referrer:{" "}
                        <Link
                          href={job.referrer}
                          target="_blank"
                          className="text-blue-500"
                        >
                          {job.referrer}
                        </Link>
                      </Text>
                      <Text>
                        Job URL:{" "}
                        <Link
                          href={job.url}
                          target="_blank"
                          className="text-blue-500"
                        >
                          {job.url}
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
                        {format(new Date(job.date), "dd MMM yyyy")} (
                        {formatDistance(new Date(job.date), new Date(), {
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

// const Column = React.memo(({ status, requests }) => {
//   return (
//     <div className="w-1/3 bg-gray-200 p-2 rounded border border-gray-300">
//       <h2 className="text-lg font-bold mb-2 text-center border-b pb-1">
//         {status}
//       </h2>
//       {requests.map((job) => (
//         <Card key={job.id} job={job} />
//       ))}
//     </div>
//   );
// });

// const Card = React.memo(({ job }) => {
//   return (
//     <div className="bg-white p-2 rounded mb-2 border border-gray-300">
//       <p className="font-semibold">{job.title}</p>
//       <p className="text-xs text-gray-500">Works at: {job.worksAt}</p>
//       <p className="text-xs text-gray-500">
//         Applied on: {format(parseISO(job.appliedDate), "MMM dd, yyyy")}
//       </p>
//     </div>
//   );
// });

export default ReferralKanban;
