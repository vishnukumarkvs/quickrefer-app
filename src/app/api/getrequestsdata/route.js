import { authOptions } from "@/lib/auth";
import driver from "@/lib/neo4jClient";
import { getServerSession } from "next-auth";

export async function GET(req) {
  const usesseion = await getServerSession(authOptions);

  const getRequestsData = `
      MATCH (u:User {userId: $userId})<-[:SENT_FRIEND_REQUEST]-(u2:User)-[r:FOR_JOB_URL]->(u)
      OPTIONAL MATCH (u2)-[:WORKS_AT]->(company:Company)
      RETURN u2.userId as senderId, u2.fullname as fullname, u2.experience as experience, u2.email as email, u2.username as username, company.name as companyName, r.url as jobURL
  `;

  const session = driver.session({ database: process.env.NEO4J_DATABASE });
  try {
    const getResult = await session.executeRead((tx) => {
      const result = tx.run(getRequestsData, {
        userId: usesseion.user.id,
      });
      return result;
    });

    // console.log(`Write result:`, getResult);
    return new Response(JSON.stringify(getResult), { status: 200 });
  } catch (error) {
    console.error("Error querying Neo4j:", error);
    return new Response("Internal Server error", { status: 500 });
  } finally {
    await session.close();
  }
}
