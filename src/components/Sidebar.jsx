"use client";
import { poppins } from "@/lib/fonts";
import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "@chakra-ui/react";

const SideBarItem = ({ title, href }) => {
  const pathname = usePathname();

  return (
    <p
      className={`${
        poppins.className
      } py-1 cursor-pointer hover:text-gray-600 ${
        pathname === href ? "text-gray-600 bg-white -ml-1 p-1 rounded-md" : ""
      }`}
    >
      <Link href={href || "/"}>{title}</Link>
    </p>
  );
};

const SideBar = () => {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </div>
    );
  }
  // console.log(session);
  return (
    <div className="w-[15%] md:w-[20%] lg:w-[25%] min-w-[200px] max-w-[300px] h-screen bg-[#ffc800] border p-4">
      <div className="mt-5 h-full flex flex-col justify-between items-center">
        <div className="text-left flex flex-col">
          <div className="my-10">
            <p
              className={`${poppins.className} py-2 text-lg text-[#7B3F00] underline decoration-2 underline-offset-8`}
            >
              MENU
            </p>
            <SideBarItem title="Ask for Referral" href="/ask-referral" />
            <SideBarItem title="Referral Status" href="/referral-status" />
            <SideBarItem title="Chat" href="/dashboard" />
            <SideBarItem
              title="Profile"
              href={`/user/${session.user.jtusername}`}
            />
          </div>
        </div>
        <div className="flex items-center mb-5">
          <Avatar>
            <AvatarImage src={session.user.image} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="p-1">
            <p>{session.user.jtusername}</p>
            {/* <p>{session.user.email}</p> */}
          </div>
          <SignOutButton />
        </div>
      </div>
    </div>
  );
};

export default SideBar;
