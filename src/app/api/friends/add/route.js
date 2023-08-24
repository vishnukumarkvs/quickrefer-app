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

    if (!sessionAuth.user.isResume) {
      return new Response("Please upload Resume in your Profile page", {
        status: 403,
      });
    }

    if (idToAdd === sessionAuth.user.id) {
      return new Response("You cannot add yourself as a friend", {
        status: 400,
      });
    }

    ///////////////////
    // Define the Cypher query to check for existing relationships between users
    const existingRelationshipsQuery = `
    MATCH (u:User {userId: $userId})
    RETURN 
      EXISTS((u)-[:SENT_FRIEND_REQUEST]->(:User {userId: $friendId})) as sentFriendRequest,
      EXISTS((u)-[:FRIENDS_WITH]->(:User {userId: $friendId})) as friendsWith
    `;

    // Execute the query with the given userId and friendId
    const existingRelationshipsResult = await session.run(
      existingRelationshipsQuery,
      {
        userId: sessionAuth.user.id,
        friendId: idToAdd,
      }
    );

    // Check if there are any records returned
    if (existingRelationshipsResult.records.length > 0) {
      const record = existingRelationshipsResult.records[0];

      // Extract values from the record
      const sentFriendRequest = record.get("sentFriendRequest");
      const friendsWith = record.get("friendsWith");

      // Check if a friend request has already been sent
      if (sentFriendRequest) {
        return new Response("Friend request already sent", { status: 409 }); // Conflict status
      }

      // Check if they are already friends
      if (friendsWith) {
        return new Response("You are already friends with this person", {
          status: 409,
        }); // Conflict status
      }
    }

    ///////////////////

    const myDataQuery = `
      MATCH (f:User {userId: $userId})-[:WORKS_AT]-(c:Company)
      RETURN f.userId as senderId, f.fullname as fullname, f.experience as experience, f.email as email, f.username as username, c.name as companyName
    `;
    const myDataResult = await session.run(myDataQuery, {
      userId: sessionAuth.user.id,
    });

    if (myDataResult.records.length === 0) {
      return new Response("Friend data not found", { status: 404 });
    }

    const myData = myDataResult.records[0].toObject();
    const { senderId, fullname, experience, email, username, companyName } =
      myData;

    await pusherServer.trigger(
      toPusherKey(`user:${idToAdd}:incoming_friend_requests`),
      "incoming_friend_requests",
      {
        senderId: senderId,
        username: username,
        experience: experience,
        email: email,
        companyName: companyName,
        jobURL: url,
        fullname: fullname,
      }
    );

    // TODO: currenlty one can send multiple req to same person
    const addFriendRequestQuery = `
      MATCH (u:User {userId: $userId}), (f:User {userId: $friendId})
      MERGE (u)-[:SENT_FRIEND_REQUEST]->(f)
      MERGE (u)-[:FOR_JOB_URL{url: $url, applied_on: datetime(), asked_to : $friendId}]->(:URLS {nodeId: 1})
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
