import { authOptions } from "@/lib/auth";
import driver from "@/lib/neo4jClient";
import { getServerSession } from "next-auth";

export async function POST(req) {
  const usession = await getServerSession(authOptions);
  const { workId } = await req.json();

  try {
    const neo4jSession = driver.session({ database: "neo4j" });
    let query = `
    MATCH (user:User {userId: $userId})-[r:HAS_WORK_EXPERIENCE]->(work:WorkExperience {workId: $workId})
    DELETE r, work
    `;

    const writeResult = await neo4jSession.executeWrite((tx) =>
      tx.run(query, {
        userId: usession.user.id,
        workId: workId,
      })
    );

    return new Response(JSON.stringify("Delete Successful"), { status: 200 });
  } catch (e) {
    console.log(e);
    return new Response(
      "Internal Server Error, Not able to update user profile data",
      { status: 500 }
    );
  }
}
