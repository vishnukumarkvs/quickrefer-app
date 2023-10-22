import SidebarChatList from "@/components/chat/SidebarChatList";
import { authOptions } from "@/lib/auth";
import driver from "@/lib/neo4jClient";
import { getFriendsByUserIds } from "@/helpers/get-friends-by-user-ids";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

const AcceptedFriends = async () => {
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
  return <SidebarChatList sessionId={session.user.id} friends={sentFriends} />;
};

export default AcceptedFriends;
