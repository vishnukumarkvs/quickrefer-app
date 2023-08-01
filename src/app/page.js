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
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function CallToActionWithAnnotation() {
  const router = useRouter();
  return (
    <>
      <Container maxW={"3xl"}>
        <Stack
          as={Box}
          textAlign={"center"}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}
        >
          <Heading
            fontWeight={600}
            fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
            lineHeight={"110%"}
          >
            Connecting Tech Talents: <br />
            <Text as={"span"} color={"#ffc800e5"}>
              Request and Give Referrals!
            </Text>
          </Heading>
          <Text color={"gray.500"}>
            The ultimate hub for IT professionals seeking career opportunities.
            Seamlessly request and provide referrals. Join our thriving
            community and build meaningful connections that power your tech
            journey!
          </Text>
          <Stack
            direction={"column"}
            spacing={3}
            align={"center"}
            alignSelf={"center"}
            position={"relative"}
          >
            <Button
              bg={"#ffc800e5"}
              rounded={"full"}
              px={6}
              _hover={{
                bg: "#ffc800e5",
              }}
              onClick={() => signIn("google")}
            >
              Login with Google
            </Button>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}
