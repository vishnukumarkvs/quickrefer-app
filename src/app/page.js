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
import Image from "next/image";

export default function CallToActionWithAnnotation() {
  const router = useRouter();
  useEffect(() => {
    analytics.page();
    registersw();
  }, []);
  return (
    <Box minH={"100vh"}>
      <Flex
        bg={"#fcbd0b"}
        color={"white"}
        px={{ base: 5, md: 12 }}
        py={4}
        gap="2"
        alignItems="center"
        cursor="pointer"
        onClick={() => {
          window.location.href = "/";
        }}
      >
        <Image
          src="/android-chrome-512x512.png"
          width="50"
          height="50"
          alt="Quick Refer Logo"
        />
        <Text fontSize="2xl" fontWeight="bold">
          QuickRefer
        </Text>
      </Flex>
      <Flex
        direction={"column"}
        textAlign={"center"}
        py={{ base: 20, md: 36 }}
        px={{ base: 10, md: 24 }}
        justifyContent={"center"}
        alignItems={"center"}
        height={"100%"}
      >
        <Heading
          fontWeight={600}
          fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
          lineHeight={"110%"}
          mb="7"
        >
          Connecting Tech Talents <br />
          <Text as={"span"} color={"#ffc800e5"}>
            Request and Give Referrals!
          </Text>
        </Heading>
        <Text color={"gray.500"} mb="10">
          The ultimate hub for IT professionals seeking career opportunities.
          Seamlessly request and provide referrals. Join our thriving network
          and build meaningful connections that power your tech journey!
        </Text>
        <Stack
          direction={"column"}
          spacing={3}
          align={"center"}
          alignSelf={"center"}
          position={"relative"}
        >
          <Flex gap="2">
            <Button
              size={{
                base: "sm",
                md: "md",
              }}
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
            <Button
              size={{
                base: "sm",
                md: "md",
              }}
              bg="black"
              color="white"
              rounded={"full"}
              onClick={() => {
                router.push("/search");
              }}
            >
              Search for Referrals
            </Button>
          </Flex>
          <Flex gap="2">
            <Text color={"blackAlpha.900"} textDecoration="underline">
              <a href="/policy" target="_blank" rel="noopener noreferrer">
                Privacy Policy,
              </a>
            </Text>
            <Text color={"blackAlpha.900"} textDecoration="underline">
              <a href="/faqs" target="_blank" rel="noopener noreferrer">
                FAQs
              </a>
            </Text>
          </Flex>
        </Stack>
      </Flex>
    </Box>
  );
}
