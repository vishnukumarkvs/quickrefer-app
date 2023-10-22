import FriendRequestsSidebarOption from "@/components/chat/FriendRequestsSidebarOption";
import SidebarChatList from "@/components/chat/SidebarChatList";
import { getFriendsByUserIds } from "@/helpers/get-friends-by-user-ids";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import driver from "@/lib/neo4jClient";

import { Icons } from "@/components/chat/icons";
import { notFound } from "next/navigation";
import LoggedNavbar from "@/components/LoggedNavbar";
import BottomNavbar from "@/components/chat/BottomBar";

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
  if (!session) notFound(); // this wont be called if you handle it in middleware

  return (
    <main className="flex-grow">
      <div className="w-full flex min-h-screen max-h-screen overflow-hidden">
        <div className="hidden lg:flex max-h-screen w-full max-w-xs grow flex-col gap-y-5 overflow-y-hidden border-r border-gray-200 bg-white px-6">
          {/* <Link href="/dashboard" className="flex h-16 shrink-0 items-center">
          <Icons.Logo className="h-8 w-auto text-indigo-600" />
        </Link> */}
          <nav
            className="flex flex-1 flex-col mt-12"
            id="chat-dashboard-sidebar"
          >
            <ul role="list" className="list-none flex flex-1 flex-col gp-y-7">
              <li>
                <FriendRequestsSidebarOption
                  sessionId={session.user.id}
                  initialUnseenRequestCount={unseenRequestCount}
                />
              </li>
              <li>
                <p className="text-sm font-semibold text-amber-950 p-1 underline underline-offset-4">
                  Accepted Requests
                </p>
                <SidebarChatList
                  sessionId={session.user.id}
                  friends={acceptedFriends}
                />
              </li>
              <li>
                <p className="text-sm font-semibold text-amber-950 p-1 underline underline-offset-4">
                  Sent Requests
                </p>
                <SidebarChatList
                  sessionId={session.user.id}
                  friends={sentFriends}
                />
              </li>
            </ul>
          </nav>
        </div>
        <aside className="max-h-screen overflow-hidden container py-4 w-full">
          {children}
        </aside>
        <BottomNavbar
          session={session}
          unseenRequestCount={unseenRequestCount}
          acceptedFriends={acceptedFriends}
          sentFriends={sentFriends}
        />
      </div>
    </main>
  );
};

export default Layout;
