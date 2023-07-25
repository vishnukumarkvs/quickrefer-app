import driver from "@/lib/neo4jClient";

export async function GET(req) {
  const url = new URL(req.url);
  const jobId = url.searchParams.get("jobId");
  const getAppliedUsersOfJob = `
    MATCH (n:User)-[:APPLIED_TO]->(j:Job {jobId: $jobId})
    RETURN n
`;

  const session = driver.session({ database: "neo4j" });
  try {
    const getResult = await session.executeRead((tx) => {
      const result = tx.run(getAppliedUsersOfJob, { jobId: jobId });
      return result;
    });

    console.log(`Write result:`, getResult);
    return new Response(JSON.stringify(getResult), { status: 200 });
  } catch (error) {
    console.error("Error querying Neo4j:", error);
    return new Response("Internal Server error", { status: 500 });
  } finally {
    await session.close();
  }
}
