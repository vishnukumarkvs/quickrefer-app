import driver from "@/lib/neo4jClient";

// export const getFriendsByUserIds = async (userId) => {
//   const friendListQuery = `
//     MATCH (u:User {userId: $userId})-[r:FRIENDS_WITH]->(f:User)
//     RETURN f.userId as userId, f.username as name
//   `;
//   const result = await driver.session().run(friendListQuery, {
//     userId: userId,
//   });

//   const friends = result.records.map((record) => {
//     const userId = record.get("userId");
//     const name = record.get("name");
//     return { userId, name };
//   });

//   return friends;
// };

export const getFriendsByUserIds = async (userId) => {
  const friendsQuery = `
    MATCH (u:User {userId: $userId})-[r:FRIENDS_WITH]->(f:User)
    RETURN f.userId as userId, f.username as name, r.initiator as initiator
  `;

  const session = driver.session();

  try {
    const result = await session.run(friendsQuery, { userId: userId });

    const friends = result.records.map((record) => {
      const userId = record.get("userId");
      const name = record.get("name");
      const initiator = record.get("initiator");
      const status = initiator === userId ? "sent" : "accepted";
      return { userId, name, status };
    });

    return friends;
  } catch (error) {
    console.error("Error fetching friends:", error);
    return [];
  } finally {
    await session.close();
  }
};
