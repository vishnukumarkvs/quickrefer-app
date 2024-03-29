"use client";

import LoggedNavbar from "@/components/LoggedNavbar";
import SideBar from "@/components/Sidebar";
import { Box } from "@chakra-ui/react";

export default function RootLayout({ children }) {
  return (
    <Box minH="100vh">
      <LoggedNavbar />
      <Box ml={{ base: 0, lg: 60 }}>{children}</Box>
    </Box>
  );
}
