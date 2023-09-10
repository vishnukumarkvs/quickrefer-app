import { authOptions } from "@/lib/auth";
import driver from "@/lib/neo4jClient";
import { getServerSession } from "next-auth";
import { nanoid } from "nanoid";

export async function POST(req) {
  const usession = await getServerSession(authOptions);
  const { workTitle, workCompany, workDescription } = await req.json();

  try {
    const neo4jSession = driver.session({
      database: process.env.NEO4J_DATABASE,
    });
    let query = `
        MATCH (user:User {userId: $userId}) 
        CREATE (work:WorkExperience {
            workId: $workId,
            workTitle: $workTitle,
            workCompany: $workCompany,
            workDescription: $workDescription
        })
        CREATE (user)-[:HAS_WORK_EXPERIENCE]->(work)
      `;

    const writeResult = await neo4jSession.executeWrite((tx) =>
      tx.run(query, {
        userId: usession.user.id,
        workId: nanoid(5),
        workTitle: workTitle,
        workCompany: workCompany,
        workDescription: workDescription,
      })
    );

    return new Response(JSON.stringify("Create Successful"), { status: 200 });
  } catch (e) {
    console.log(e);
    return new Response(
      "Internal Server Error, Not able to update user profile data",
      { status: 500 }
    );
  }
}
