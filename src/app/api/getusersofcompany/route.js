import driver from "@/lib/neo4jClient";

export async function POST(req) {
  const { company } = await req.json();
  const getUsersOfCompany = `
  MATCH (n:User)-[:WORKS_AT]->(c:Company {name: $company})
    RETURN n
    ORDER BY RAND()
    LIMIT 4;
`;

  const session = driver.session({ database: "neo4j" });
  try {
    const getResult = await session.executeRead((tx) => {
      const result = tx.run(getUsersOfCompany, { company: company });
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
