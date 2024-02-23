"use client";

import LoggedNavbar from "@/components/LoggedNavbar";
import SideBar from "@/components/Sidebar";
import analytics from "@/lib/analytics";
import { Box } from "@chakra-ui/react";
import { useEffect } from "react";

export default function RootLayout({ children }) {
  useEffect(() => {
    analytics.page();
  }, []);
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
