"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Flex,
  HStack,
  Text,
  VStack,
  Input,
  Select,
  Link,
} from "@chakra-ui/react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { GoOrganization } from "react-icons/go";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

const FriendRequests = ({ incomingFriendRequests, sessionId }) => {
  const router = useRouter();
  const [friendRequests, setFriendRequests] = useState(incomingFriendRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState("");

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    );
    pusherClient.bind("incoming_friend_requests", (data) => {
      setFriendRequests((prevRequests) => [...prevRequests, data]);
    });

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      );
      pusherClient.unbind("incoming_friend_requests", (data) => {
        setFriendRequests((prevRequests) => [...prevRequests, data]);
      });
    };
  }, [sessionId]);

  const acceptFriend = async (senderId, jobURL) => {
    await axios.post("/api/friends/accept", { id: senderId, url: jobURL });

    setFriendRequests((prev) => {
      return prev.filter((fr) => fr.senderId !== senderId);
    });

    router.refresh();
  };

  const denyFriend = async (senderId) => {
    await axios.post("/api/friends/deny", { id: senderId });

    setFriendRequests((prev) => {
      return prev.filter((fr) => fr.senderId !== senderId);
    });

    router.refresh();
  };

  const filteredFriendRequests = friendRequests.filter((friendRequest) => {
    // Check if the search term matches any of the fields (jobURL, companyName, or fullname)
    return (
      friendRequest.jobURL.includes(searchTerm) ||
      friendRequest.companyName.includes(searchTerm) ||
      friendRequest.fullname.includes(searchTerm)
    );
  });

  const sortedFriendRequests = [...filteredFriendRequests].sort((a, b) => {
    if (sortCriteria === "experience") {
      return b.experience - a.experience;
    }
    // Add more sorting criteria if needed
    return 0;
  });

  return (
    <div className="my-5">
      <VStack spacing={5} align="stretch">
        {/* <Box p={5} shadow="md" bg="white" rounded={"md"}>
          <Flex flexWrap={"wrap"} gap="2">
            <Input
              placeholder="Search by company name, or person name or Job URL"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              colorScheme="yellow"
              variant={sortCriteria ? "solid" : "outline"}
              onClick={() => {
                if (sortCriteria) {
                  setSortCriteria("");
                } else {
                  setSortCriteria("experience");
                }
              }}
            >
              Sort by Experience
            </Button>
          </Flex>
        </Box> */}
        {sortedFriendRequests.length === 0 ? (
          <Box p={5} shadow="md" bg="white" rounded={"md"}>
            <Text>Click on accepted or sent requests to view them here</Text>
          </Box>
        ) : (
          sortedFriendRequests.map((friendRequest, index) => (
            <Box
              shadow="md"
              bg="white"
              rounded={"md"}
              key={friendRequest.senderId}
              p={5}
              overflow="hidden"
            >
              <Text fontSize="xl" fontWeight={500} mt={2}>
                {friendRequest.fullname}{" "}
                {`(${friendRequest.experience} experience)`}
              </Text>
              <Flex mt="3" alignItems={"center"} flexWrap={"wrap"}>
                Works At: &nbsp;
                <b>{friendRequest.companyName}</b> &nbsp;
              </Flex>
              Role: <b>{friendRequest.jobTitle || "Software Engineer"}</b>
              <br />
              <Link
                href={`/user/${friendRequest.username}`}
                isExternal
                color="blue.500"
                className="text-blue-500 underline"
              >
                View Profile
              </Link>
              <Text mt={5} fontSize={{ base: "md", lg: "lg" }}>
                Requesting referral for{" "}
                <Link
                  href={`/job/${friendRequest.jobURL}`}
                  isExternal
                  color="blue.500"
                  className="text-blue-500 underline truncate"
                >
                  {friendRequest.jobURL}
                </Link>
              </Text>
              <HStack mt={4} spacing={4}>
                <Button
                  onClick={() =>
                    acceptFriend(friendRequest.senderId, friendRequest.jobURL)
                  }
                  colorScheme="teal"
                  variant="outline"
                  leftIcon={<FaCheck />}
                >
                  Accept
                </Button>
                <Button
                  onClick={() => denyFriend(friendRequest.senderId)}
                  colorScheme="red"
                  variant="outline"
                  leftIcon={<FaTimes />}
                >
                  Deny
                </Button>
              </HStack>
            </Box>
          ))
        )}
      </VStack>
    </div>
  );
};

export default FriendRequests;
