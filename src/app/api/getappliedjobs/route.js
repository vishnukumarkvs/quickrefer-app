import { authOptions } from "@/lib/auth";
import driver from "@/lib/neo4jClient";
import { getServerSession } from "next-auth";

export async function GET(req) {
  const usession = await getServerSession(authOptions);
  const getAllAppliedJobs = `
    MATCH (u:User {userId: $userId})-[:APPLIED_TO]->(j:Job)
    RETURN j
    ORDER BY j.applied_on DESC
  `;

  const session = driver.session({ database: "neo4j" });
  try {
    const getResult = await session.executeRead((tx) => {
      const result = tx.run(getAllAppliedJobs, {
        userId: usession.user.id,
      });
      return result;
    });

    console.log(`Write result:`, getResult);
    return new Response("", { status: 200 });
  } catch (error) {
    console.error("Error applying to job", error);
    return new Response("Internal Server error", { status: 500 });
  } finally {
    await session.close();
  }
}
