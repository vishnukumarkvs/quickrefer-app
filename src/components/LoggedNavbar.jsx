"use client";

import React, { ReactNode, useEffect, useState } from "react";
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import { ReactText } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
//import all icons
import { FaUsers, FaQuestion } from "react-icons/fa";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { BsFillChatFill } from "react-icons/bs";
import { BiSolidUserCircle } from "react-icons/bi";
import { FiMenu } from "react-icons/fi";
import Link from "next/link";

const get_all_unseen = process.env.NEXT_PUBLIC_GET_ALL_UNSEEN_URL;
if (!get_all_unseen) {
  console.error("NEXT_PUBLIC_GET_ALL_UNSEEN_URL is not defined");
}

export default function LoggedNavbar() {
  const { data: session, status } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [unseenCount, setUnseenCount] = useState();

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchData = async () => {
      const response = await axios.get(
        `${get_all_unseen}?userId=${session?.user?.id}`
      );
      const response2 = await axios.get("/api/getfriends");
      let result = (
        parseInt(response.data.sumSeenCount) + parseInt(response2.data)
      ).toString();
      setUnseenCount(result);
    };

    fetchData();
  }, [session?.user?.id]);

  return (
    <Box className={"bg-yellow-200"}>
      <SidebarContent
        session={session}
        unseenCount={unseenCount}
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent
            onClose={onClose}
            session={session}
            unseenCount={unseenCount}
          />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
    </Box>
  );
}

const SidebarContent = ({ onClose, unseenCount, session, ...rest }) => {
  const [LinkItems, setLinkItems] = useState([]);
  useEffect(() => {
    setLinkItems([
      { name: "Ask for Referral", link: "/ask-referral", icon: FaUsers },
      {
        name: "Referral Status",
        link: "/referral-status",
        icon: HiOutlineStatusOnline,
      },
      {
        name: "Chat",
        link: "/dashboard/requests",
        icon: BsFillChatFill,
      },
      {
        name: "Profile",
        link: `/user/${session?.user?.jtusername}`,
        icon: BiSolidUserCircle,
      },
      { name: "FAQ", link: "/faq", icon: FaQuestion },
    ]);
  }, [session]);
  return (
    <Box
      bg={"yellow.200"}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      zIndex={2}
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontWeight="bold">
          Quick Refer
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} link={link.link}>
          {link.name}
          {unseenCount > 0 && link.name == "Chat" && (
            <p className="bg-[#3453b9] rounded-full text-white px-2 ml-2">
              {unseenCount}
            </p>
          )}
        </NavItem>
      ))}
    </Box>
  );
};

const NavItem = ({ icon, children, link, ...rest }) => {
  return (
    <Link href={link} passHref>
      <Box
        as="a"
        style={{ textDecoration: "none" }}
        _focus={{ boxShadow: "none" }}
      >
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          _hover={{
            bg: "yellow.400",
            color: "white",
          }}
          {...rest}
        >
          {icon && (
            <Icon
              mr="4"
              fontSize="16"
              _groupHover={{
                color: "white",
              }}
              as={icon}
            />
          )}
          {children}
        </Flex>
      </Box>
    </Link>
  );
};

const MobileNav = ({ onOpen, ...rest }) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={"#ffc800"}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="solid"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
        bg="yellow.200"
      />

      <Text fontSize="2xl" ml="8" fontWeight="bold">
        Quick Refer
      </Text>
    </Flex>
  );
};
