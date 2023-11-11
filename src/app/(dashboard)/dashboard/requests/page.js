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
      MATCH (u:User {userId: $userId})<-[:SENT_FRIEND_REQUEST]-(u2:User)
      OPTIONAL MATCH (u2)-[r:FOR_JOB_URL]->(urls:URLS {nodeId: 1}) WHERE r.asked_to = $userId
      WITH u2, r 
      ORDER BY r.applied_on DESC 
      WITH u2, COLLECT(r)[0] as latestRelation
      OPTIONAL MATCH (u2)-[:WORKS_AT]->(company:Company)
      RETURN 
          u2.userId as senderId,  
          u2.fullname as fullname, 
          u2.experience as experience, 
          u2.email as email, 
          u2.username as username,
          u2.currentJobRole as jobRole,
          company.name as companyName, 
          latestRelation.url as jobURL
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
          jobURL: record.get("jobURL"),
          jobRole: record.get("jobRole"),
        };
      });
    });

  return (
    <main className="mt-8">
      <h1 className="ml-2 font-bold text-5xl">Accept and Chat</h1>
      <div className="flex flex-col">
        <FriendRequests
          incomingFriendRequests={incomingFriendRequests}
          sessionId={session.user.id}
        />
      </div>
    </main>
  );
};

export default Page;
