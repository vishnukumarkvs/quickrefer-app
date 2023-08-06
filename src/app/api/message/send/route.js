import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { messageValidator } from "@/lib/validations/message";
import { ref, set } from "firebase/database";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";
import driver from "@/lib/neo4jClient";

// function linkify(text) {
//   const urlRegex = /(https?:\/\/[^\s]+)/g;
//   return text.replace(
//     urlRegex,
//     (url) => `<a href="${url}" target="_blank">${url}</a>`
//   );
// }

export async function POST(req) {
  try {
    const { text, chatId } = await req.json();
    // console.log("message api", text, chatId);
    const session = await getServerSession(authOptions);
    if (!session) return new Response("Unauthorized", { status: 401 });

    const [userId1, userId2] = chatId.split("--");

    if (session.user.id !== userId1 && session.user.id !== userId2)
      return new Response("Unauthorized", { status: 401 });

    const friendId = session.user.id === userId1 ? userId2 : userId1;

    const friendListQuery = `
      MATCH (u:User {userId: $userId})-[r:FRIENDS_WITH]-(f:User)
      RETURN f.userId as friendId
    `;
    const result = await driver.session().run(friendListQuery, {
      userId: session.user.id,
    });
    const friendList = result.records.map((record) => record.get("friendId"));
    const isFriend = friendList.includes(friendId);

    if (!isFriend) return new Response("Unauthorized", { status: 401 });

    const timestamp = Date.now();
    const messageData = {
      id: nanoid(),
      senderId: session.user.id,
      text: text,
      timestamp: timestamp,
      seen: false,
    };

    const message = messageValidator.parse(messageData);

    await set(ref(db, `chat/${chatId}/messages/${timestamp}`), message)
      .then(() => {
        // console.log("Message sent successfully");
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
    return new Response("OK");
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }
    return new Response("Internal Server Error", { status: 500 });
  }
}
