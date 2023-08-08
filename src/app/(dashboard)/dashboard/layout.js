"use client";

import FriendRequestsSidebarOption from "@/components/chat/FriendRequestsSidebarOption";
import SidebarChatList from "@/components/chat/SidebarChatList";
import SignOutButton from "@/components/SignOutButton";
import UserAvatar from "@/components/chat/userAvatar";
import { getFriendsByUserIds } from "@/helpers/get-friends-by-user-ids";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import driver from "@/lib/neo4jClient";
import Provider from "@/components/Providers";
import "../../globals.css";
//poppins import
import { poppins } from "@/lib/fonts";

const { Icons } = require("@/components/chat/icons");
const { notFound } = require("next/navigation");

// const sidebarOptions = [
//   {
//     id: 1,
//     name: "Add Friend",
//     href: "/dashboard/add",
//     Icon: "UserPlus",
//   },
// ];

const Layout = async ({ children }) => {
  const session = await getServerSession(authOptions);

  const friends = await getFriendsByUserIds(session.user.id);
  const acceptedFriends = friends.filter(
    (friend) => friend.status === "accepted"
  );
  const sentFriends = friends.filter((friend) => friend.status === "sent");

  const result = await driver.session().run(
    `
  MATCH (u:User {userId: $userId})<-[:SENT_FRIEND_REQUEST]-(u2:User)
  RETURN u2
  `,
    { userId: session.user.id }
  );

  const unseenRequestCount = result.records.length;
  console.log(unseenRequestCount);

  console.log(unseenRequestCount);
  if (!session) notFound(); // this wont be called if you handle it in middleware

  return (
    <html lang="en">
      <body className={`bg-[#fbf9f0] ${poppins.className}`}>
        <div className="flex">
          <main className="flex-grow">
            <div className="w-full flex h-screen">
              <div className="flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
                <Link
                  href="/dashboard"
                  className="flex h-16 shrink-0 items-center"
                >
                  <Icons.Logo className="h-8 w-auto text-indigo-600" />
                </Link>
                {/* <div className="text-xs font-semibold text-gray-500 leading-6">
                  Your chats
                </div> */}
                <nav className="flex flex-1 flex-col">
                  <ul
                    role="list"
                    className="list-none flex flex-1 flex-col gp-y-7"
                  >
                    <li>
                      <p>Accepted Requests:</p>
                      <SidebarChatList
                        sessionId={session.user.id}
                        friends={acceptedFriends}
                      />
                    </li>
                    <li>
                      <p>Sent Requests:</p>
                      <SidebarChatList
                        sessionId={session.user.id}
                        friends={sentFriends}
                      />
                    </li>
                    {/* <li>
                      <div className="text-xs font-semibold leading-6 text-gray-400">
                        Overview
                      </div>
                      <ul role="list" className="-mx-2 mt-2 space-y-1">
                        {sidebarOptions &&
                          sidebarOptions.map((option) => {
                            const Icon = Icons[option.Icon];
                            return (
                              <li key={option.id}>
                                <a
                                  href={option.href}
                                  className="text-gray-700 hover:text-indigo-600 hover-bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                >
                                  <span className="text-gray-400 border-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                                    <Icon className="h-4 w-4" />
                                  </span>
                                  <span className="truncate">
                                    {option.name}
                                  </span>
                                </a>
                              </li>
                            );
                          })}
                      </ul>
                    </li> */}
                    <li>
                      <FriendRequestsSidebarOption
                        sessionId={session.user.id}
                        initialUnseenRequestCount={unseenRequestCount}
                      />
                    </li>
                    <li className="-mx-6 mt-auto flex items-center">
                      <div className="flex flex-1 items-center gap-x-y px-6 py-3 text-sm font-semi-bold leading-6 text-gray-900">
                        <div className="relative h-8 w-8  m-2">
                          <UserAvatar name={session.user.name} />
                        </div>
                        <span className="sr-only">Your profile</span>
                        <div className="flex flex-col">
                          <span aria-hidden="true">{session.user.name}</span>
                          <span
                            className="text-xs text-zinc-400"
                            aria-hidden="true"
                          >
                            {session.user.email}
                          </span>
                        </div>
                      </div>
                      <SignOutButton className="h-full aspect-square" />
                    </li>
                  </ul>
                </nav>
              </div>
              <aside className="max-h-screen container py-16 md:py-12 w-full">
                {children}
              </aside>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
};

export default Layout;
