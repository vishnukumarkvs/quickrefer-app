import { authOptions } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
// import { addFriendValidator } from "@/lib/validations/add-friend";
import { getServerSession } from "next-auth";
import { z } from "zod";
import driver from "@/lib/neo4jClient";

const addFriendSchema = z.object({
  id: z.string(),
  url: z.string(),
});

export async function POST(req) {
  const session = driver.session();
  try {
    const input = await req.json();
    addFriendSchema.parse(input);

    const { id: idToAdd, url } = input;

    const sessionAuth = await getServerSession(authOptions);
    if (!sessionAuth) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (idToAdd === sessionAuth.user.id) {
      return new Response("You cannot add yourself as a friend", {
        status: 400,
      });
    }

    const friendDataQuery = `
      MATCH (f:User {userId: $friendId})-[:WORKS_AT]-(c:Company)
      RETURN f.userId as senderId, f.fullname as fullname, f.experience as experience, f.email as email, f.username as username, c.name as companyName
    `;
    const friendDataResult = await session.run(friendDataQuery, {
      friendId: idToAdd,
    });

    if (friendDataResult.records.length === 0) {
      return new Response("Friend data not found", { status: 404 });
    }

    const friendData = friendDataResult.records[0].toObject();
    const { senderId, fullname, experience, email, username, companyName } =
      friendData;

    pusherServer.trigger(
      toPusherKey(`user:${idToAdd}:incoming_friend_requests`),
      "incoming_friend_requests",
      {
        senderId: senderId,
        fullname,
        experience,
        email,
        username,
        companyName,
        url: url,
      }
    );

    const addFriendRequestQuery = `
      MATCH (u:User {userId: $userId}), (f:User {userId: $friendId})
      CREATE (u)-[:SENT_FRIEND_REQUEST {applied_on: datetime()}]->(f)
      CREATE (u)-[:FOR_JOB_URL{url: $url}]->(f)
    `;
    await session.run(addFriendRequestQuery, {
      userId: sessionAuth.user.id,
      friendId: idToAdd,
      url: url,
    });

    return new Response("OK");
  } catch (err) {
    console.error(err);
    if (err instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }
    return new Response("Invalid Request", { status: 400 });
  } finally {
    await session.close(); // Always close your session when you're done!
  }
}
