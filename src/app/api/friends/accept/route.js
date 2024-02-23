import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import { chatHrefConstructor, toPusherKey } from "@/lib/utils";
import { getServerSession } from "next-auth";
import driver from "@/lib/neo4jClient";
// import { messageValidator } from "@/lib/validations/message";
import ddbClient from "@/lib/ddbclient";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";

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

    await pusherServer.trigger(
      toPusherKey(`user:${idToAdd}:friends`),
      "new_friend",
      {}
    );

    const addFriendQuery = `
      MATCH (u:User {userId: $userId}), (f:User {userId: $friendId})
      MERGE (u)-[r:FRIENDS_WITH {initiator: $friendId}]->(f)
      MERGE (f)-[r2:FRIENDS_WITH {initiator: $friendId}]->(u)
      WITH u, f
      MATCH (f)-[sent:SENT_FRIEND_REQUEST]->(u)
      SET u.AcceptScore = COALESCE(u.AcceptScore, 0) + 1
      DELETE sent
    `;

    // console.log("Start1");

    await session.run(addFriendQuery, {
      userId: sessionAuth.user.id,
      friendId: idToAdd,
    });
    // console.log("Start2");

    const currentUnixTimestamp = Math.floor(Date.now() / 1000);
    const chatId = chatHrefConstructor(sessionAuth.user.id, idToAdd);

    let content = `Hello, could you kindly consider providing a referral for the job: ${url}. Thank you.`;

    const messageParams = {
      TableName: "QrChatMessages3",
      Item: {
        chatId: { S: chatId },
        timestamp: { N: currentUnixTimestamp.toString() },
        senderId: { S: idToAdd },
        // receiverId: { S: receiverId },
        content: { S: content },
      },
    };

    await ddbClient.send(new PutItemCommand(messageParams));

    return new Response("OK");
  } catch (error) {
    console.error("Failed to accept friend request:", error);
    return new Response("Failed to accept friend request", { status: 500 });
  } finally {
    await session.close(); // Always close your session when you're done!
  }
}
