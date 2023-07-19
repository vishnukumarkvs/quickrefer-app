"use client";
import { rajdhani } from "@/lib/fonts";
import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";
import { MessagesSquare } from "lucide-react";
import { usePathname } from "next/navigation";

const SideBarItem = ({ title, href }) => {
  const pathname = usePathname();

  return (
    <p
      className={`${
        rajdhani.className
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
              className={`${rajdhani.className} py-2 text-lg text-[#7B3F00] underline decoration-2 underline-offset-8`}
            >
              Job Search
            </p>
            <SideBarItem title="Online Jobs" href="/homepage" />
            <SideBarItem title="Referral Jobs" />
            <SideBarItem title="HR jobs" />
            <SideBarItem title="Ask for Referral" href="/askforreferral" />
          </div>
          <div className="my-10">
            <p
              className={`${rajdhani.className} py-2 text-lg text-[#7B3F00] underline decoration-2 underline-offset-8
`}
            >
              Job Status
            </p>
            <SideBarItem title="Kanban Board" href="/kanbanjobstatus" />
            <SideBarItem title="Saved Jobs" />
          </div>
          <div className="my-10">
            <p
              className={`${rajdhani.className} py-2 text-lg text-[#7B3F00] underline decoration-2 underline-offset-8`}
            >
              Job Create
            </p>
            <SideBarItem title="Create Job" href="/addjob" />
            <SideBarItem title="Dashboard" />
          </div>
          <div className="my-12">
            <a
              href="/dashboard"
              className={`${rajdhani.className} py-1 cursor-pointer`}
            >
              <span className="flex gap-x-2 items-center">
                Chat
                <MessagesSquare size={20} />
              </span>
            </a>
          </div>
        </div>
        <div className="flex items-center">
          <p className={`${rajdhani.className} p-2`}>@username</p>
          <SignOutButton />
        </div>
      </div>
    </div>
  );
};

export default SideBar;
