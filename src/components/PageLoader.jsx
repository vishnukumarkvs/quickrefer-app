"use client";
import { Flex } from "@chakra-ui/react";
import BeatLoader from "react-spinners/BeatLoader";

const PageLoader = () => {
  return (
    <Flex
      height={"100vh"}
      width={"full"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <BeatLoader color="#ffc800e5" />
    </Flex>
  );
};

export default PageLoader;
