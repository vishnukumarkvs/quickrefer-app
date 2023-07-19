import { authOptions } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { getServerSession } from "next-auth";
import { z } from "zod";
import driver from "@/lib/neo4jClient";

export async function POST(req) {
  try {
    const { id: idToAdd } = await req.json();

    // const { email: emailToAdd } = addFriendValidator.parse(body.email);

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

    // if user already added
    // const isAlreadyAdded =
    //   (await fetchRedis(
    //     "sismember",
    //     `user:${idToAdd}:incoming_friend_requests`,
    //     session.user.id
    //   )) === 1;

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

    // const isAlreadyFriends =
    //   (await fetchRedis(
    //     "sismember",
    //     `user:${session.user.id}:friends`,
    //     idToAdd
    //   )) === 1;

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

    // send friend request
    pusherServer.trigger(
      toPusherKey(`user:${idToAdd}:incoming_friend_requests`),
      "incoming_friend_requests",
      {
        senderId: session.user.id,
        senderEmail: session.user.email,
      }
    );
    // redis.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id);

    // add friend request to neo4j
    const addFriendRequestQuery = `
      MATCH (u:User {userId: $userId}), (f:User {userId: $friendId})
      CREATE (u)-[:SENT_FRIEND_REQUEST]->(f)
    `;
    await driver.session().run(addFriendRequestQuery, {
      userId: session.user.id,
      friendId: idToAdd,
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
