"use client";

import Head from "next/head";
import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  Icon,
  useColorModeValue,
  createIcon,
  Flex,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import registersw from "@/components/register-serviceworker";
import { useEffect } from "react";
import analytics from "@/lib/analytics";

export default function CallToActionWithAnnotation() {
  const router = useRouter();
  useEffect(() => {
    analytics.page();
    registersw();
  }, []);
  return (
    <Flex
      direction={"column"}
      textAlign={"center"}
      gap={{ base: 8, md: 14 }}
      py={{ base: 20, md: 36 }}
      px={{ base: 10, md: 24 }}
      justifyContent={"center"}
      alignItems={"center"}
      height={"100%"}
      minH={"100vh"}
    >
      <Heading
        fontWeight={600}
        fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
        lineHeight={"110%"}
      >
        Connecting Tech Talents <br />
        <Text as={"span"} color={"#ffc800e5"}>
          Request and Give Referrals!
        </Text>
      </Heading>
      <Text color={"gray.500"}>
        The ultimate hub for IT professionals seeking career opportunities.
        Seamlessly request and provide referrals. Join our thriving network and
        build meaningful connections that power your tech journey!
      </Text>
      <Stack
        direction={"column"}
        spacing={3}
        align={"center"}
        alignSelf={"center"}
        position={"relative"}
      >
        <Text color={"blackAlpha.900"}>
          <a href="/policy" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
        </Text>
        <Text color={"blackAlpha.900"}>
          <a href="/faqs" target="_blank" rel="noopener noreferrer">
            FAQS
          </a>
        </Text>
        <Button
          bg={"#ffc800e5"}
          rounded={"full"}
          px={6}
          _hover={{
            bg: "#ffc800e5",
          }}
          onClick={() => signIn("google")}
        >
          Sign in with Google
        </Button>
      </Stack>
    </Flex>
  );
}
