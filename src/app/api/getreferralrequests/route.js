import { authOptions } from "@/lib/auth";
import driver from "@/lib/neo4jClient";
import { getServerSession } from "next-auth";

export async function GET(req) {
  const usesseion = await getServerSession(authOptions);

  const getReferralRequestsOfUser = `
  MATCH (u:User {userId: $userId})
  OPTIONAL MATCH (u)-[:SENT_FRIEND_REQUEST]->(u1:User)-[:WORKS_AT]->(c1:Company)
  OPTIONAL MATCH (u)-[:FRIENDS_WITH]->(u2:User)-[:WORKS_AT]->(c2:Company)
  RETURN COLLECT({user: u1, company: c1}) AS sentFriendRequests, COLLECT({user: u2, company: c2}) AS friends
    `;

  const session = driver.session({ database: "neo4j" });
  try {
    const getResult = await session.executeRead((tx) => {
      const result = tx.run(getReferralRequestsOfUser, {
        userId: usesseion.user.id,
      });
      return result;
    });

    console.log(`Write result:`, getResult);
    return new Response(JSON.stringify(getResult), { status: 200 });
  } catch (error) {
    console.error("Error querying Neo4j:", error);
    return new Response("Internal Server error", { status: 500 });
  } finally {
    await session.close();
  }
}