import driver from "@/lib/neo4jClient";
import { revalidatePath } from "next/cache";

export async function GET(req) {
  const getAllCompaniesQuery = `
  MATCH (n:Company)
  RETURN COLLECT(n.name) AS companyNames
`;

  const session = driver.session({ database: "neo4j" });
  try {
    const getResult = await session.executeRead((tx) => {
      const result = tx.run(getAllCompaniesQuery, {});
      return result;
    });

    // const path = "/api/getCompanyList";
    const path = req.nextUrl.searchParams.get("path") || "/";
    revalidatePath(path);

    return new Response(JSON.stringify(getResult), { status: 200 });
  } catch (error) {
    console.error("Error querying Neo4j:", error);
    return new Response("Internal Server error", { status: 500 });
  } finally {
    await session.close();
  }
}
