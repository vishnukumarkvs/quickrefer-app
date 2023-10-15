import { authOptions } from "@/lib/auth";
import driver from "@/lib/neo4jClient";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function GET(req) {
  const usession = await getServerSession(authOptions);
  const getAllFriendsCountQuery = `
      MATCH (u:User {userId: $userId})<-[:SENT_FRIEND_REQUEST]-(u2:User)
      RETURN COUNT(u2) as friendRequestCount
`;

  const session = driver.session({ database: process.env.NEO4J_DATABASE });
  try {
    const getResult = await session.executeRead((tx) => {
      const result = tx.run(getAllFriendsCountQuery, {
        userId: usession.user.id,
      });
      return result;
    });

    const friendRequestCount = getResult.records[0]
      .get("friendRequestCount")
      .toNumber();

    const path = req.nextUrl.searchParams.get("path") || "/";
    revalidatePath(path);

    return new Response(JSON.stringify(friendRequestCount), { status: 200 });
  } catch (error) {
    console.error("Error querying Neo4j:", error);
    return new Response("Internal Server error", { status: 500 });
  } finally {
    await session.close();
  }
}
