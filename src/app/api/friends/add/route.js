import { authOptions } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { getServerSession } from "next-auth";
import { z } from "zod";
import driver from "@/lib/neo4jClient";

export async function POST(req) {
  try {
    const { id: idToAdd, url } = await req.json();

    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (idToAdd === session.user.id) {
      return new Response("You cannot add yourself as a friend", {
        status: 400,
      });
    }

    console.log("idToAdd", idToAdd, "session.user.id", session.user.id);

    const isAlreadyAddedQuery = `
      MATCH (u:User {userId: $userId})-[r:SENT_FRIEND_REQUEST]-(f:User {userId: $friendId})
      RETURN COUNT(r) > 0 AS isAlreadyAdded
    `;
    const result = await driver.session().run(isAlreadyAddedQuery, {
      userId: session.user.id,
      friendId: idToAdd,
    });

    const isAlreadyAdded = result.records[0].get("isAlreadyAdded");

    console.log("isAlreadyAdded", isAlreadyAdded);

    if (isAlreadyAdded) {
      return new Response("You already sent request", { status: 400 });
    }

    const isAlreadyFriendsQuery = `
      MATCH (u:User {userId: $userId})-[r:FRIENDS_WITH]-(f:User {userId: $friendId})
      RETURN COUNT(r) > 0 AS isAlreadyFriends
    `;
    const result2 = await driver.session().run(isAlreadyFriendsQuery, {
      userId: session.user.id,
      friendId: idToAdd,
    });

    const isAlreadyFriends = result2.records[0].get("isAlreadyFriends");

    if (isAlreadyFriends) {
      return new Response("You already added this person", { status: 400 });
    }

    // Fetch friend's data for Pusher
    const friendDataQuery = `
      MATCH (f:User {userId: $friendId})-[:WORKS_AT]-(c:Company)
      RETURN f.userId as senderId, f.fullname as fullname, f.experience as experience, f.email as email, f.username as username, c.name as companyName
    `;
    const friendDataResult = await driver.session().run(friendDataQuery, {
      friendId: idToAdd,
    });

    const friendData = friendDataResult.records[0].toObject();
    const { senderId, fullname, experience, email, username, companyName } =
      friendData;

    // Send friend request data via Pusher
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

    // Add friend request to neo4j
    const addFriendRequestQuery = `
      MATCH (u:User {userId: $userId}), (f:User {userId: $friendId})
      CREATE (u)-[:SENT_FRIEND_REQUEST]->(f)
      CREATE (u)-[:FOR_JOB_URL{url: $url}]->(f)
    `;
    await driver.session().run(addFriendRequestQuery, {
      userId: session.user.id,
      friendId: idToAdd,
      url: url,
    });

    return new Response("OK");
  } catch (err) {
    console.error(err);
    if (err instanceof z.ZodError) {
      return new Response("invalid request payload", { status: 422 });
    }
    return new Response("Invalid Request", { status: 400 });
  }
}
