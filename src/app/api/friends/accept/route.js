import { authOptions } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { getServerSession } from "next-auth";
import driver from "@/lib/neo4jClient";

export async function POST(req) {
  try {
    const { id: idToAdd } = await req.json();
    console.log(idToAdd);

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    // verify both users are not already friends
    // const isAlreadyFriends = await fetchRedis(
    //   "sismember",
    //   `user:${session.user.id}:friends`,
    //   idToAdd
    // );

    const isAlreadyFriendsQuery = `
      MATCH (u:User {id: $userId})-[r:FRIENDS_WITH]-(f:User {id: $friendId})
      RETURN COUNT(r) > 0 AS isAlreadyFriends
    `;

    const isAlreadyFriends = await driver.session().run(isAlreadyFriendsQuery, {
      userId: session.user.id,
      friendId: idToAdd,
    });

    if (isAlreadyFriends) {
      return new Response("Already friends", { status: 400 }); // 400 = BAD REQUEST
    }

    // check again if the current user has this friend request or not
    // const hasFriendRequest = await fetchRedis(
    //   "sismember",
    //   `user:${session.user.id}:incoming_friend_requests`,
    //   idToAdd
    // );

    const hasFriendRequestQuery = `
      MATCH (u:User {id: $userId})-[r:SENT_FRIEND_REQUEST]-(f:User {id: $friendId})
      RETURN COUNT(r) > 0 AS hasFriendRequest
    `;
    const hasFriendRequest = await driver.session().run(hasFriendRequestQuery, {
      userId: session.user.id,
      friendId: idToAdd,
    });

    if (!hasFriendRequest) {
      return new Response("No friend request", { status: 400 });
    }

    pusherServer.trigger(
      toPusherKey(`user:${idToAdd}:friends`),
      "new_friend",
      {}
    );

    // add user to friends list
    // await redis.sadd(`user:${session.user.id}:friends`, idToAdd);
    // await redis.sadd(`user:${idToAdd}:friends`, session.user.id);

    const addFriendQuery = `
      MATCH (u:User {id: $userId}), (f:User {id: $friendId})
      CREATE (u)-[r:FRIENDS_WITH]->(f)
      CREATE (f)-[r2:FRIENDS_WITH]->(u)
    `;

    await driver.session().run(addFriendQuery, {
      userId: session.user.id,
      friendId: idToAdd,
    });

    // await redis.srem(
    //   `user:${session.user.id}:incoming_friend_requests`,
    //   idToAdd
    // );

    const removeFriendRequestQuery = `
      MATCH (u:User {id: $userId})-[r:SENT_FRIEND_REQUEST]-(f:User {id: $friendId})
      DELETE r
    `;

    await driver.session().run(removeFriendRequestQuery, {
      userId: session.user.id,
      friendId: idToAdd,
    });

    return new Response("OK");
  } catch (error) {
    console.error("Failed to accept friend request:", error);
    return new Response("Failed to accept friend request", { status: 500 });
  }
}
