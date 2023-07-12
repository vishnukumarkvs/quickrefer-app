"use client";
import { rajdhani } from "@/lib/fonts";
import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";
import { MessagesSquare } from "lucide-react";

const SideBar = () => {
  return (
    <div className="w-[25%] md:w-[20%] lg:w-[15%] min-w-[200px] max-w-[300px] h-screen bg-[#ffc800]">
      <div className="mt-10 flex flex-col justify-center items-center">
        <div className="text-left">
          <div className="my-10">
            <p
              className={`${rajdhani.className} py-2 text-lg text-[#7B3F00] underline decoration-2 underline-offset-8`}
            >
              Job Search
            </p>
            <Link
              href="/homepage"
              className={`${rajdhani.className} py-1 cursor-pointer hover:text-gray-600`}
            >
              Online Jobs
            </Link>
            <p className={`${rajdhani.className} py-1 cursor-pointer`}>
              Referral Jobs
            </p>
            <p className={`${rajdhani.className} py-1 cursor-pointer`}>
              HR jobs
            </p>
            <p className={`${rajdhani.className} py-1 cursor-pointer`}>
              Ask for Referral
            </p>
          </div>
          <div className="my-10">
            <p
              className={`${rajdhani.className} py-2 text-lg text-[#7B3F00] underline decoration-2 underline-offset-8
`}
            >
              Job Status
            </p>
            <p className={`${rajdhani.className} py-1 cursor-pointer`}>
              Applied Jobs
            </p>
            <p className={`${rajdhani.className} py-1 cursor-pointer`}>
              Saved Jobs
            </p>
            <p className={`${rajdhani.className} py-1 cursor-pointer`}>
              Jobs Dashboard
            </p>
          </div>
          <div className="my-10">
            <p
              className={`${rajdhani.className} py-2 text-lg text-[#7B3F00] underline decoration-2 underline-offset-8`}
            >
              Job Create
            </p>
            <p className={`${rajdhani.className} py-1 cursor-pointer`}>
              Create Job
            </p>
            <p className={`${rajdhani.className} py-1 cursor-pointer`}>
              Dashboard
            </p>
          </div>
          <div className="my-12">
            <div className="">
              <a
                href="/homepage"
                className={`${rajdhani.className} py-1 cursor-pointer`}
              >
                <span className="flex gap-x-2 items-center">
                  Chat
                  <MessagesSquare size={20} />
                </span>
              </a>
            </div>
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
