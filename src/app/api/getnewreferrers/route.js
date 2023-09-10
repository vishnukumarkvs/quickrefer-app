import { authOptions } from "@/lib/auth";
import driver from "@/lib/neo4jClient";
import { getServerSession } from "next-auth";

export async function GET(req) {
  const usesseion = await getServerSession(authOptions);
  // const { company } = await req.json();
  const url = new URL(req.url);
  const company = url.searchParams.get("company");
  const getUsersOfCompany = `
    MATCH (n:User {userRole: "Referrer"})-[:WORKS_AT]->(c:Company {name: $company})
    WHERE NOT EXISTS((n)-[:FRIENDS_WITH]->(:User {userId: $requester}))
    AND n.userId <> $requester
    RETURN n
    ORDER BY RAND() 
    LIMIT 4;
    `;

  const session = driver.session({ database: process.env.NEO4J_DATABASE });
  try {
    const getResult = await session.executeRead((tx) => {
      const result = tx.run(getUsersOfCompany, {
        company: company,
        requester: usesseion.user.id,
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
