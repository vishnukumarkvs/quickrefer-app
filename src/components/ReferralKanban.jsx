"use client";

import React, { useState, useMemo } from "react";
import { format, parseISO, isWithinInterval, formatDistance } from "date-fns";
import axios from "axios";

// UI Components
import {
  Card,
  Flex,
  Input,
  Link,
  Tab,
  Tabs,
  Tag,
  Text,
  TabList,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";
import DatePickerWithRange from "./DateRangePicker";
import PageLoader from "./PageLoader";

// Hooks
import { useQuery } from "@tanstack/react-query";
import EmptyComponent from "./emptystates/EmptyComponent";

const REQUESTED = "requested";
const AVAILABLE_FOR_CHAT = "availableForChat";

const fetchReferralRequests = async () => {
  const { data } = await axios.get("/api/getreferralrequests");
  console.log("holahola", data);
  if (!data || !data.records || !Array.isArray(data.records)) {
    throw new Error("Invalid data structure from API");
  }
  return processData(data.records);
};

const transformDate = (applied_on) => {
  try {
    return new Date(
      applied_on.year?.low,
      (applied_on.month?.low || 1) - 1,
      applied_on.day?.low,
      applied_on.hour?.low,
      applied_on.minute?.low,
      applied_on.second?.low,
      applied_on.nanosecond?.low / 1000000
    )
      .toISOString()
      .substring(0, 10);
  } catch (error) {
    console.error("Error transforming date:", error);
    return null;
  }
};

const transformRecord = (record, status) => {
  const transformedRecord = {
    id: record.user.userId,
    fullname: record.user.fullname,
    username: record.user.username,
    job_url: record.job_url || null,
    status,
    appliedDate: transformDate(record.applied_on),
    worksAt: record.company.name || "Unknown Company",
  };
  return transformedRecord;
};

const processData = (records) => {
  if (!Array.isArray(records)) {
    return { sentFriendRequests: [], friends: [] };
  }

  const allRequests = records.flatMap((record) => {
    const fields = record._fields;
    return {
      relationship: fields[0],
      user: fields[1].properties,
      company: fields[2].properties,
      applied_on: fields[3],
      job_url: fields[4],
    };
  });

  const sentFriendRequests = allRequests
    .filter((request) => request.relationship === "sentFriendRequest")
    .map((request) => transformRecord(request, REQUESTED));

  const friends = allRequests
    .filter((request) => request.relationship === "friends")
    .map((request) => transformRecord(request, AVAILABLE_FOR_CHAT));

  console.log("bhola", sentFriendRequests, friends);
  return { sentFriendRequests, friends };
};

// ... (previous imports and constants remain unchanged)

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

  const { sentRequests, friendRequests } = useMemo(() => {
    if (!userData) return { sentRequests: [], friendRequests: [] };

    const filterJobs = (jobs) => {
      return jobs
        .filter((job) => {
          return (job.fullname + " " + job.worksAt)
            .replace(/\s/g, "")
            .toLowerCase()
            .includes(filter.replace(/\s/g, "").toLowerCase());
        })
        .filter((job) => {
          if (selectedDates?.from && selectedDates?.to) {
            return isWithinInterval(parseISO(job.appliedDate), {
              start: selectedDates.from,
              end: selectedDates.to,
            });
          }
          return true;
        });
    };

    const sentRequests = filterJobs(userData.sentFriendRequests);
    const friendRequests = filterJobs(userData.friends);

    return { sentRequests, friendRequests };
  }, [userData, filter, selectedDates]);

  return (
    <Flex direction="column" gap="7" p="5">
      {isLoading ? (
        <PageLoader />
      ) : isError ? (
        <div>Error: {error.message}</div>
      ) : (
        <React.Fragment>
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
                  {sentRequests?.length > 0 ? (
                    sentRequests.map((job) => {
                      const {
                        worksAt = "Unknown",
                        username,
                        fullname,
                        job_url,
                        appliedDate,
                      } = job;

                      return (
                        <Card
                          key={job.id || username}
                          variant={"elevated"}
                          p="4"
                        >
                          <Flex justifyContent={"space-between"}>
                            <Flex direction={"column"} gap="2">
                              <Text fontSize={"xl"} fontWeight={"bold"}>
                                {worksAt}
                              </Text>
                              <Text>
                                Referrer:{" "}
                                <Link
                                  href={`/user/${username}`}
                                  target="_blank"
                                  className="text-blue-500"
                                >
                                  {fullname}
                                </Link>
                              </Text>
                              {job_url && (
                                <Text>
                                  Job URL:{" "}
                                  <Link
                                    href={job_url}
                                    target="_blank"
                                    className="text-blue-500"
                                  >
                                    {job_url}
                                  </Link>
                                </Text>
                              )}
                            </Flex>
                            <Flex
                              direction={"column"}
                              gap="5"
                              borderLeft={"1px solid black"}
                              px="4"
                            >
                              {appliedDate && (
                                <>
                                  <Text fontSize={"xl"} letterSpacing={2}>
                                    Applied on
                                  </Text>
                                  <Tag>
                                    {format(
                                      new Date(appliedDate),
                                      "dd MMM yyyy"
                                    )}{" "}
                                    (
                                    {formatDistance(
                                      new Date(appliedDate),
                                      new Date(),
                                      {
                                        addSuffix: true,
                                      }
                                    )}
                                    )
                                  </Tag>
                                </>
                              )}
                            </Flex>
                          </Flex>
                        </Card>
                      );
                    })
                  ) : (
                    <EmptyComponent title="No referrals applied" />
                  )}
                </Flex>
              </TabPanel>
              <TabPanel>
                {/* For now, this is a placeholder. You would need to fetch and display the users who referred the main user here. */}
                <Flex direction={"column"} gap="5">
                  {/* Map over the referrals received by the user. For now, I'm reusing the same `requests` data for demonstration. */}
                  {friendRequests?.length > 0 ? (
                    friendRequests.map((job) => {
                      const {
                        worksAt = "Unknown",
                        username,
                        fullname,
                        job_url,
                        appliedDate,
                      } = job;

                      return (
                        <Card
                          key={job.id || username}
                          variant={"elevated"}
                          p="4"
                        >
                          <Flex justifyContent={"space-between"}>
                            <Flex direction={"column"} gap="2">
                              <Text fontSize={"xl"} fontWeight={"bold"}>
                                {worksAt}
                              </Text>
                              <Text>
                                Referred by:{" "}
                                <Link
                                  href={`/user/${username}`}
                                  target="_blank"
                                  className="text-blue-500"
                                >
                                  {fullname}
                                </Link>
                              </Text>
                              {job_url && (
                                <Text>
                                  Job URL:{" "}
                                  <Link
                                    href={job_url}
                                    target="_blank"
                                    className="text-blue-500"
                                  >
                                    {job_url}
                                  </Link>
                                </Text>
                              )}
                            </Flex>
                            <Flex
                              direction={"column"}
                              gap="5"
                              borderLeft={"1px solid black"}
                              px="4"
                            >
                              {appliedDate && (
                                <>
                                  <Text fontSize={"xl"} letterSpacing={2}>
                                    Referred on
                                  </Text>
                                  <Tag>
                                    {format(
                                      new Date(appliedDate),
                                      "dd MMM yyyy"
                                    )}{" "}
                                    (
                                    {formatDistance(
                                      new Date(appliedDate),
                                      new Date(),
                                      {
                                        addSuffix: true,
                                      }
                                    )}
                                    )
                                  </Tag>
                                </>
                              )}
                            </Flex>
                          </Flex>
                        </Card>
                      );
                    })
                  ) : (
                    <EmptyComponent title="No referrals received yet!!" />
                  )}
                </Flex>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </React.Fragment>
      )}
    </Flex>
  );
};

export default ReferralKanban;
