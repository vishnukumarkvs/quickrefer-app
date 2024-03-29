"use client";

import LoggedNavbar from "@/components/LoggedNavbar";
import SideBar from "@/components/Sidebar";
import { Box } from "@chakra-ui/react";

export default function RootLayout({ children }) {
  return (
    <Box minH="100vh">
      <LoggedNavbar />
      <Box
        px={{ base: "25px", lg: "20px" }}
        py={{ base: "15px", lg: "30px" }}
        ml={{ base: 0, lg: 60 }}
      >
        {children}
      </Box>
    </Box>
  );
}
