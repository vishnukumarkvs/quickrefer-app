"use client";
import { poppins } from "@/lib/fonts";
import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";
import { usePathname } from "next/navigation";

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
  return (
    <div className="w-[25%] md:w-[20%] lg:w-[15%] min-w-[200px] max-w-[300px] h-screen bg-[#ffc800] border">
      <div className="mt-5 flex flex-col justify-center items-center">
        <div className="text-left">
          <div className="my-10">
            <p
              className={`${poppins.className} py-2 text-lg text-[#7B3F00] underline decoration-2 underline-offset-8`}
            >
              Job Search
            </p>
            <SideBarItem title="Ask for Referral" href="/application" />
            <SideBarItem title="Referral Status" href="/referral-status" />
          </div>
          <div className="my-12">
            <SideBarItem title="Chat" href="/dashboard" />
          </div>
        </div>
        <div className="flex items-center">
          <p className={`${poppins.className} p-2`}>@username</p>
          <SignOutButton />
        </div>
      </div>
    </div>
  );
};

export default SideBar;
