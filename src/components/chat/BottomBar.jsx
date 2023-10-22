"use client";

import { Box, Flex, Text, Spacer, Tag } from "@chakra-ui/react";
import { FaUsers, FaUserCheck, FaUserPlus } from "react-icons/fa";

function BottomNavbar({
  session,
  unseenRequestCount,
  acceptedFriends,
  sentFriends,
}) {
  return (
    <Box
      display={{ base: "flex", lg: "hidden" }}
      alignItems="center"
      justifyContent="space-around"
      py="3"
      bg="white"
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      w={{ base: "full", lg: "0px" }}
    >
      {/* <Box>
        <FaUsers size={24} />
        <Text mt="1" fontSize="sm">
          Friend Requests
        </Text>
        {unseenRequestCount > 0 && (
          <Box
            bg="red.500"
            color="white"
            rounded="full"
            w="6"
            h="6"
            fontSize="sm"
            textAlign="center"
            position="absolute"
            top="-2"
            right="-2"
          >
            {unseenRequestCount}
          </Box>
        )}
      </Box> */}
      <Box>
        <Flex gap="2" alignItems={"center"}>
          <FaUserCheck size={24} />
          <Tag colorScheme="green" rounded={"full"}>
            {acceptedFriends.length}
          </Tag>
        </Flex>
        <Text mt="1" fontSize="sm">
          Accepted Requests
        </Text>
      </Box>
      <Box>
        <Flex gap="2" alignItems={"center"}>
          <FaUserPlus size={24} />
          <Tag colorScheme="yellow" rounded={"full"}>
            {sentFriends.length}
          </Tag>
        </Flex>
        <Text mt="1" fontSize="sm">
          Sent Requests
        </Text>
      </Box>
    </Box>
  );
}

export default BottomNavbar;
