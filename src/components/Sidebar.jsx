"use client";
import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect } from "react";
import { Skeleton } from "./ui/skeleton";

const SideBarItem = ({ title, href }) => {
  const pathname = usePathname();

  return (
    <p
      className={`py-1 cursor-pointer hover:text-gray-600 ${
        pathname === href ? "text-gray-600 bg-white -ml-1 p-1 rounded-md" : ""
      }`}
    >
      <Link href={href || "/"}>{title}</Link>
    </p>
  );
};

const SideBar = () => {
  const { data: session, status } = useSession();
  // Use useEffect to perform actions when session changes
  // useEffect(() => {
  //   if (status === "authenticated") {
  //     // Perform any actions you need after authentication
  //     console.log("Session authenticated:", session);
  //   }
  // }, [status, session]);
  if (status === "loading") {
    return (
      <div className="w-[15%] md:w-[20%] lg:w-[25%] min-w-[200px] max-w-[300px] h-screen p-4 bg-yellow-200">
        <div className="mt-5 h-full flex flex-col justify-between items-center">
          {/* Skeleton for the menu title and menu items */}
          <div className="text-left flex flex-col">
            <div className="py-10">
              <div className="p-1">
                <Skeleton className="h-6 w-14" />
              </div>
              <div className="p-1">
                <Skeleton className="h-6 w-24" />
              </div>
              <div className="p-1">
                <Skeleton className="h-6 w-24" />
              </div>
              <div className="p-1">
                <Skeleton className="h-6 w-24" />
              </div>
              <div className="p-1">
                <Skeleton className="h-6 w-24" />
              </div>
              <div className="p-1">
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          </div>
          {/* Skeleton for the user details and sign-out button */}
          <div className="flex items-center mb-5 space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" /> {/* Avatar */}
            <div className="p-1">
              <Skeleton className="h-4 w-20" /> {/* Username */}
            </div>
            <Skeleton className="h-6 w-6" /> {/* SignOutButton */}
          </div>
        </div>
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
              className={`py-2 text-lg text-[#7B3F00] underline decoration-2 underline-offset-8`}
            >
              MENU
            </p>
            <SideBarItem title="Ask for Referral" href="/ask-referral" />
            <SideBarItem title="Referral Status" href="/referral-status" />
            <SideBarItem title="Chat" href="/dashboard/requests" />
            <SideBarItem
              title="Profile"
              href={`/user/${session.user.jtusername}`}
            />
            <SideBarItem title="FAQ" href="/faq" />
          </div>
        </div>
        <div className="flex items-center mb-5">
          <Avatar>
            <AvatarImage src={session.user.image} />
            <AvatarFallback>
              {session.user?.jtusername?.substring(0, 2) || "##"}
            </AvatarFallback>
          </Avatar>
          <div className="p-1">
            <p>{session?.user?.jtusername || "###"}</p>
            {/* <p>{session.user.email}</p> */}
          </div>
          <SignOutButton />
        </div>
      </div>
    </div>
  );
};

export default SideBar;
