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
      MERGE (u)-[r:FRIENDS_WITH]->(f)
      MERGE (f)-[r2:FRIENDS_WITH]->(u)
      WITH u, f
      MATCH (u)-[sent:SENT_FRIEND_REQUEST]->(f)
      DELETE sent
    `;

    const addFriendResult = await session.run(addFriendQuery, {
      userId: sessionAuth.user.id,
      friendId: idToAdd,
    });

    if (addFriendResult.summary.counters.updates().relationshipsDeleted === 0) {
      return new Response("Friend request does not exist", { status: 404 });
    }

    const timestamp = Date.now();
    const messageData = {
      id: nanoid(),
      senderId: idToAdd,
      text: "I want a referral request for the joburl: " + url,
      timestamp: timestamp,
      seen: false,
    };
    const message = messageValidator.parse(messageData);

    const chatId = chatHrefConstructor(sessionAuth.user.id, idToAdd);

    await set(ref(db, `chat/${chatId}/messages/${timestamp}`), message)
      .then(() => {
        console.log("Message sent successfully");
      })
      .catch((error) => {
        console.error("Error sending message:", error);
        throw error; // Propagate the error to the catch block
      });

    return new Response("OK");
  } catch (error) {
    console.error("Failed to accept friend request:", error);
    return new Response("Failed to accept friend request", { status: 500 });
  } finally {
    await session.close(); // Always close your session when you're done!
  }
}
