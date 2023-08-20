"use client";

import { Flex, Text } from "@chakra-ui/react";

const EmptyComponent = ({ title }) => {
  return (
    <Flex
      direction={"column"}
      justifyContent="center"
      alignItems="center"
      my="4"
      p="4"
      gap="4"
      bg="white"
      boxShadow={"md"}
      borderRadius={"md"}
    >
      <img height={"200px"} width={"200px"} src="/empty-box.png" alt="empty" />
      <Text width={"40%"} textAlign={"center"} fontSize="xl" color="gray.500">
        {title || "No data found"}
      </Text>
    </Flex>
  );
};

export default EmptyComponent;
