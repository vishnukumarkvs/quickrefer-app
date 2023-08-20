import React from "react";
import { Flex, Button } from "@chakra-ui/react";
import { FaGithub, FaLinkedin, FaBlog, FaBriefcase } from "react-icons/fa";

const SocialButtons = ({ data }) => {
  return (
    <Flex direction="row" gap={4}>
      {data?.linktree?.properties?.github && (
        <Button
          as="a"
          href={data?.linktree?.properties?.github}
          target="_blank"
          leftIcon={<FaGithub />}
          colorScheme="gray"
        >
          GitHub
        </Button>
      )}
      {data?.linktree?.properties?.linkedin && (
        <Button
          as="a"
          href={data?.linktree?.properties?.linkedin}
          target="_blank"
          leftIcon={<FaLinkedin />}
          colorScheme="blue"
        >
          LinkedIn
        </Button>
      )}
      {data?.linktree?.properties?.blog && (
        <Button
          as="a"
          href={data?.linktree?.properties?.blog}
          target="_blank"
          leftIcon={<FaBlog />}
          colorScheme="teal"
        >
          Blog
        </Button>
      )}
      {data?.linktree?.properties?.portfolio && (
        <Button
          as="a"
          href={data?.linktree?.properties?.portfolio}
          target="_blank"
          leftIcon={<FaBriefcase />}
          colorScheme="purple"
        >
          Portfolio
        </Button>
      )}
    </Flex>
  );
};

export default SocialButtons;
