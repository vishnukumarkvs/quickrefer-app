import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import driver from "@/lib/neo4jClient";

export async function POST(req) {
  const session = driver.session();
  try {
    const { id: idToDeny } = await req.json();
    const sessionAuth = await getServerSession(authOptions);
    if (!sessionAuth) {
      return new Response("Unauthorized", { status: 401 });
    }

    const denyFriendRequestQuery = `
      MATCH (u:User {userId: $userId})<-[r:SENT_FRIEND_REQUEST]-(f:User {userId: $friendId})
      DELETE r
    `;
    await session.run(denyFriendRequestQuery, {
      userId: sessionAuth.user.id,
      friendId: idToDeny,
    });

    return new Response("OK");
  } catch (error) {
    console.error("Failed to deny friend request:", error);
    return new Response("Failed to deny friend request", { status: 500 });
  } finally {
    await session.close();
  }
}
