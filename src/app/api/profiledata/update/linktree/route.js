import { authOptions } from "@/lib/auth";
import driver from "@/lib/neo4jClient";
import { getServerSession } from "next-auth";

export async function POST(req) {
  const usession = await getServerSession(authOptions);
  const { github, linkedin, blog, portfolio } = await req.json();

  try {
    const neo4jSession = driver.session({ database: "neo4j" });

    let queryString = `
      MATCH (user:User {userId: $userId}) 
      MERGE (user)-[:HAS_LINKTREE]->(link:LinkTree)
      SET link.github = $github,
          link.linkedin = $linkedin,
          link.blog = $blog,
          link.portfolio = $portfolio
    `;

    const writeResult = await neo4jSession.executeWrite((tx) =>
      tx.run(queryString, {
        userId: usession.user.id,
        github: github,
        linkedin: linkedin,
        blog: blog,
        portfolio: portfolio,
      })
    );

    return new Response(JSON.stringify("Update Successful"), { status: 200 });
  } catch (e) {
    console.log(e);
    return new Response(
      "Internal Server Error, Not able to update user profile data",
      { status: 500 }
    );
  }
}
