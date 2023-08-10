import FriendRequestsSidebarOption from "@/components/chat/FriendRequestsSidebarOption";
import SidebarChatList from "@/components/chat/SidebarChatList";
import { getFriendsByUserIds } from "@/helpers/get-friends-by-user-ids";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import driver from "@/lib/neo4jClient";
//poppins import
import { poppins } from "@/lib/fonts";

import { Icons } from "@/components/chat/icons";
import { notFound } from "next/navigation";

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
    <div className={`bg-[#fbf9f0] ${poppins.className} flex`}>
      <main className="flex-grow">
        <div className="w-full flex h-screen">
          <div className="flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
            <Link href="/dashboard" className="flex h-16 shrink-0 items-center">
              <Icons.Logo className="h-8 w-auto text-indigo-600" />
            </Link>
            <nav className="flex flex-1 flex-col" id="chat-dashboard-sidebar">
              <ul role="list" className="list-none flex flex-1 flex-col gp-y-7">
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
                <li>
                  <FriendRequestsSidebarOption
                    sessionId={session.user.id}
                    initialUnseenRequestCount={unseenRequestCount}
                  />
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
  );
};

export default Layout;
