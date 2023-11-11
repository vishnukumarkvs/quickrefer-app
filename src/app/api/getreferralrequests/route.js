import { authOptions } from "@/lib/auth";
import driver from "@/lib/neo4jClient";
import { getServerSession } from "next-auth";

export async function GET(req) {
  const usesseion = await getServerSession(authOptions);
  // First, fetch users the main user sent friend requests to and who work at a company
  // UNION
  // Now fetch users who are friends with the main user and work at a company, excluding those already covered in sentFriendRequest

  const getReferralRequestsOfUser = `
  MATCH (u:User {userId: $userId})-[r1:SENT_FRIEND_REQUEST]->(fr:User)-[:WORKS_AT]->(c1:Company)
  MATCH (u)-[r2:FOR_JOB_URL]->(url:URLS)
  WHERE r2.asked_to = fr.userId
  RETURN 'sentFriendRequest' AS relationship, fr AS user, c1 AS company, r2.applied_on AS applied_on, r2.url AS job_url

  UNION

  MATCH (u:User {userId: $userId})-[:FRIENDS_WITH]->(f:User)-[:WORKS_AT]->(c2:Company)
  WHERE NOT (u)-[:SENT_FRIEND_REQUEST]->(f)
  MATCH (u)-[r3:FOR_JOB_URL]->(url:URLS)
  WHERE r3.asked_to = f.userId
  RETURN 'friends' AS relationship, f AS user, c2 AS company, r3.applied_on AS applied_on, r3.url AS job_url
`;

  const session = driver.session({ database: process.env.NEO4J_DATABASE });
  try {
    const getResult = await session.executeRead((tx) => {
      const result = tx.run(getReferralRequestsOfUser, {
        userId: usesseion.user.id,
      });
      return result;
    });

    return new Response(JSON.stringify(getResult), { status: 200 });
  } catch (error) {
    console.error("Error querying Neo4j:", error);
    return new Response("Internal Server error", { status: 500 });
  } finally {
    await session.close();
  }
}
