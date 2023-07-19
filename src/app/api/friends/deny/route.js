import { authOptions } from "@/lib/auth";
// import { redis } from "@/lib/redis";
import { getServerSession } from "next-auth";
import driver from "@/lib/neo4jClient";

export async function POST(req) {
  try {
    const { id: idToDeny } = await req.json();
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    // await redis.srem(
    //   `user:${session.user.id}:incoming_friend_requests`,
    //   idToDeny
    // );

    const denyFriendRequestQuery = `
      MATCH (u:User {userId: $userId})-[r:SENT_FRIEND_REQUEST]-(f:User {userId: $friendId})
      DELETE r
    `;
    await driver.session().run(denyFriendRequestQuery, {
      userId: session.user.id,
      friendId: idToDeny,
    });

    return new Response("OK");
  } catch (error) {
    console.error("Failed to deny friend request:", error);
    return new Response("Failed to deny friend request", { status: 500 });
  }
}
