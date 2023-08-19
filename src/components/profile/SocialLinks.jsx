import React from "react";
import { Flex, Button } from "@chakra-ui/react";
import { FaGithub, FaLinkedin, FaBlog, FaBriefcase } from "react-icons/fa";

const SocialButtons = ({ data }) => {
  console.log(data);
  return (
    <Flex direction="row" gap={4}>
      <Button
        as="a"
        href={data?.linktree?.properties?.github}
        target="_blank"
        leftIcon={<FaGithub />}
        colorScheme="gray"
      >
        GitHub
      </Button>
      <Button
        as="a"
        href={data?.linktree?.properties?.linkedin}
        target="_blank"
        leftIcon={<FaLinkedin />}
        colorScheme="blue"
      >
        LinkedIn
      </Button>
      <Button
        as="a"
        href={data?.linktree?.properties?.blog}
        target="_blank"
        leftIcon={<FaBlog />}
        colorScheme="teal"
      >
        Blog
      </Button>
      <Button
        as="a"
        href={data?.linktree?.properties?.portfolio}
        target="_blank"
        leftIcon={<FaBriefcase />}
        colorScheme="purple"
      >
        Portfolio
      </Button>
    </Flex>
  );
};

export default SocialButtons;
