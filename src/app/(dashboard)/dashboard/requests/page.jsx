const { default: FriendRequests } = require("@/components/chat/FriendRequests");
const { authOptions } = require("@/lib/auth");
const { getServerSession } = require("next-auth");
const { notFound } = require("next/navigation");
import driver from "@/lib/neo4jClient";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  // ids of people who sent requests to the current logged in  user
  //   const incomingSenderIds = await fetchRedis(
  //     "smembers",
  //     `user:${session.user.id}:incoming_friend_requests`
  //   );
  const incomingSenderIds = await driver
    .session()
    .run(
      `
        MATCH (u:User {userId: $userId})<-[:SENT_FRIEND_REQUEST]-(u2:User)
        RETURN u2.id
        `,
      { userId: session.user.id }
    )
    .then((result) => {
      return result.records.map((record) => record.get("u2.id"));
    });

  // console.log(incomingSenderIds);
  const incomingFriendRequests = await Promise.all(
    incomingSenderIds.map(async (senderId) => {
      //   const sender = await fetchRedis("get", `user:${senderId}`);
      const sender = await driver
        .session()
        .run(
          `
        MATCH (u:User {userId: $userId})
        RETURN u.email as email
        `,
          { userId: senderId }
        )
        .then((result) => {
          return result.records.map((record) => record.get("u"));
        });

      const senderParsed = JSON.parse(sender);
      return {
        senderId,
        senderEmail: senderParsed.email,
      };
    })
  );
  // console.log("incomingfrs", incomingFriendRequests);
  return (
    <main className="pt-8">
      <h1 className="font-bold text-5xl mb-8">Add a friend</h1>
      <div className="flex flex-col gap-4">
        <FriendRequests
          incomingFriendRequests={incomingFriendRequests}
          sessionId={session.user.id}
        />
      </div>
    </main>
  );
};

export default Page;
