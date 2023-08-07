import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import { chatHrefConstructor, toPusherKey } from "@/lib/utils";
import { getServerSession } from "next-auth";
import driver from "@/lib/neo4jClient";
import { ref, set } from "firebase/database";
import { nanoid } from "nanoid";
import { db } from "@/lib/firebase";
import { messageValidator } from "@/lib/validations/message";

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

    pusherServer.trigger(
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
      DELETE sent
    `;

    // console.log("Start1");

    await session.run(addFriendQuery, {
      userId: sessionAuth.user.id,
      friendId: idToAdd,
    });
    // console.log("Start2");

    const timestamp = Date.now();
    const messageData = {
      id: nanoid(),
      senderId: idToAdd,
      text: `Hi, could you kindly consider providing a referral for the job: ${url}. Thank you.`,
      timestamp: timestamp,
      seen: false,
    };

    const message = messageValidator.parse(messageData);

    const chatId = chatHrefConstructor(sessionAuth.user.id, idToAdd);

    await set(ref(db, `chat/${chatId}/messages/${timestamp}`), message)
      .then(() => {
        // console.log("Message sent successfully");
      })
      .catch((error) => {
        console.error("Error sending message:", error);
        throw error; // Propagate the error to the catch block
      });

    // console.log("Start3");

    return new Response("OK");
  } catch (error) {
    console.error("Failed to accept friend request:", error);
    return new Response("Failed to accept friend request", { status: 500 });
  } finally {
    await session.close(); // Always close your session when you're done!
  }
}
