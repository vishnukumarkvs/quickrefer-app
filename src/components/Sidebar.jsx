"use client";
import { poppins } from "@/lib/fonts";
import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    return <p>Loading...</p>;
  }
  console.log(session);
  return (
    <div className="w-[25%] md:w-[20%] lg:w-[15%] min-w-[200px] max-w-[300px] h-screen bg-[#ffc800] border">
      <div className="mt-5 flex flex-col justify-center items-center">
        <div className="text-left flex flex-col justify-between">
          <div className="my-10">
            <p
              className={`${poppins.className} py-2 text-lg text-[#7B3F00] underline decoration-2 underline-offset-8`}
            >
              MENU
            </p>
            <SideBarItem title="Ask for Referral" href="/application" />
            <SideBarItem title="Referral Status" href="/referral-status" />
            <SideBarItem title="Chat" href="/dashboard" />
          </div>
          <div className="flex">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <p>{session.user.email}</p>
            </div>
            <SignOutButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
