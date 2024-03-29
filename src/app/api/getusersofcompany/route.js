import driver from "@/lib/neo4jClient";

export async function GET(req) {
  // const { company } = await req.json();
  const url = new URL(req.url);
  const company = url.searchParams.get("company");
  // TODO: add conditions to check if user is referrer
  const getUsersOfCompany = `
  MATCH (n:User)-[:WORKS_AT]->(c:Company {name: $company})
    RETURN n
    ORDER BY RAND() 
    LIMIT 4;
`;

  const session = driver.session({ database: process.env.NEO4J_DATABASE });
  try {
    const getResult = await session.executeRead((tx) => {
      const result = tx.run(getUsersOfCompany, { company: company });
      return result;
    });

    return new Response(JSON.stringify(getResult), { status: 200 });
  } catch (error) {
    console.error("Error querying Neo4j:", error);
    return new Response("Internal Server error", { status: 500 });
  } finally {
    await session.close();
  }
}
