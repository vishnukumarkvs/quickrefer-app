import { authOptions } from "@/lib/auth";
import driver from "@/lib/neo4jClient";
import { getServerSession } from "next-auth";

export async function POST(req) {
  const usession = await getServerSession(authOptions);
  const { workId, workTitle, workDescription, workCompany } = await req.json();

  try {
    const neo4jSession = driver.session({
      database: process.env.NEO4J_DATABASE,
    });
    let query = `
    MATCH (user:User {userId: $userId})-[r:HAS_WORK_EXPERIENCE]->(work:WorkExperience {workId: $workId})
    SET work.workTitle = $workTitle,
        work.workDescription = $workDescription,
        work.workCompany = $workCompany
    `;

    const writeResult = await neo4jSession.executeWrite((tx) =>
      tx.run(query, {
        userId: usession.user.id,
        workId: workId,
        workTitle: workTitle,
        workDescription: workDescription,
        workCompany: workCompany,
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
