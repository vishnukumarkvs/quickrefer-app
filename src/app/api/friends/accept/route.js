import { authOptions } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import { chatHrefConstructor, toPusherKey } from "@/lib/utils";
import { getServerSession } from "next-auth";
import driver from "@/lib/neo4jClient";
import { ref, set } from "firebase/database";
import { nanoid } from "nanoid";
import { db } from "@/lib/firebase";
import { messageValidator } from "@/lib/validations/message";

export async function POST(req) {
  try {
    const { id: idToAdd, url } = await req.json();
    console.log(idToAdd, url);

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const isAlreadyFriendsQuery = `
      MATCH (u:User {userId: $userId})-[r:FRIENDS_WITH]-(f:User {userId: $friendId})
      RETURN COUNT(r) > 0 AS isAlreadyFriends
    `;

    const result0 = await driver.session().run(isAlreadyFriendsQuery, {
      userId: session.user.id,
      friendId: idToAdd,
    });

    const isAlreadyFriends = result0.records[0].get("isAlreadyFriends");

    if (isAlreadyFriends) {
      return new Response("Already friends", { status: 400 }); // 400 = BAD REQUEST
    }

    const hasFriendRequestQuery = `
      MATCH (u:User {userId: $userId})-[r:SENT_FRIEND_REQUEST]-(f:User {userId: $friendId})
      RETURN COUNT(r) > 0 AS hasFriendRequest
    `;
    const result1 = await driver.session().run(hasFriendRequestQuery, {
      userId: session.user.id,
      friendId: idToAdd,
    });

    const hasFriendRequest = result1.records[0].get("hasFriendRequest");

    if (!hasFriendRequest) {
      return new Response("No friend request", { status: 400 });
    }

    pusherServer.trigger(
      toPusherKey(`user:${idToAdd}:friends`),
      "new_friend",
      {}
    );

    const addFriendQuery = `
      MATCH (u:User {userId: $userId}), (f:User {userId: $friendId})
      CREATE (u)-[r:FRIENDS_WITH]->(f)
      CREATE (f)-[r2:FRIENDS_WITH]->(u)
      WITH r, r2
      MATCH (u)-[sent:SENT_FRIEND_REQUEST]->(f)
      DELETE sent
    `;

    await driver.session().run(addFriendQuery, {
      userId: session.user.id,
      friendId: idToAdd,
    });

    const timestamp = Date.now();
    const messageData = {
      id: nanoid(),
      senderId: idToAdd,
      text: "I want a referral request for the joburl: " + url,
      timestamp: timestamp,
      seen: false,
    };
    const message = messageValidator.parse(messageData);

    const chatId = chatHrefConstructor(session.user.id, idToAdd);

    await set(ref(db, `chat/${chatId}/messages/${timestamp}`), message)
      .then(() => {
        console.log("Message sent successfully");
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });

    return new Response("OK");
  } catch (error) {
    console.error("Failed to accept friend request:", error);
    return new Response("Failed to accept friend request", { status: 500 });
  }
}
