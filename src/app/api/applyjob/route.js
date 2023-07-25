import { authOptions } from "@/lib/auth";
import driver from "@/lib/neo4jClient";
import { getServerSession } from "next-auth";

export async function POST(req) {
  const usession = await getServerSession(authOptions);
  const { jobId } = await req.json();
  const applyjob = `
    MATCH (u:User {userId: $userId})
    MATCH (j:Job {jobId: $jobId})
    MERGE (u)-[:APPLIED_TO {applied_on: date()}]->(j)
  `;

  const session = driver.session({ database: "neo4j" });
  try {
    const getResult = await session.executeWrite((tx) => {
      const result = tx.run(applyjob, {
        userId: usession.user.id,
        jobId: jobId,
      });
      return result;
    });

    console.log(`Write result:`, getResult);
    return new Response("Applied to job successfully", { status: 200 });
  } catch (error) {
    console.error("Error applying to job", error);
    return new Response("Internal Server error", { status: 500 });
  } finally {
    await session.close();
  }
}
