import FriendRequests from "@/components/chat/FriendRequests";
import { authOptions } from "@/lib/auth";
import driver from "@/lib/neo4jClient";
import { getServerSession } from "next-auth";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const incomingFriendRequests = await driver
    .session()
    .run(
      `
      MATCH (u:User {userId: $userId})<-[:SENT_FRIEND_REQUEST]-(u2:User)-[r:FOR_JOB_URL]->(u)
      OPTIONAL MATCH (u2)-[:WORKS_AT]->(company:Company)
      RETURN u2.userId as senderId, u2.fullname as fullname, u2.experience as experience, u2.email as email, u2.username as username, company.name as companyName, r.url as jobURL
    `,
      { userId: session.user.id }
    )
    .then((result) => {
      return result.records.map((record) => {
        return {
          senderId: record.get("senderId"),
          fullname: record.get("fullname"),
          experience: record.get("experience"),
          email: record.get("email"),
          username: record.get("username"),
          companyName: record.get("companyName"),
          jobURL: record.get("jobURL"), // Include the jobURL property in the returned object
        };
      });
    });

  return (
    <main className="mt-8">
      <h1 className="font-bold text-5xl mb-8">Accept and Chat</h1>
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
