import { authOptions } from "@/lib/auth";
import driver from "@/lib/neo4jClient";
import { getServerSession } from "next-auth";

export async function GET(req) {
  const usession = await getServerSession(authOptions);
  const getAllCompaniesQuery = `
  MATCH (u:User {userId: $userId})-[:POSTED_JOB]->(j:Job)-[:REQUIRES_SKILL]->(s:Skill)
  RETURN j, COLLECT(s.name) AS required_skills
`;

  const session = driver.session({ database: "neo4j" });
  try {
    const getResult = await session.executeRead((tx) => {
      const result = tx.run(getAllCompaniesQuery, { userId: usession.user.id });
      return result;
    });

    console.log(`Write result:`, getResult);
    return new Response(JSON.stringify(getResult), { status: 200 });
  } catch (error) {
    console.error("Error querying DynamoDB:", error);
    return new Response("Internal Server error", { status: 500 });
  } finally {
    await session.close();
  }
}
