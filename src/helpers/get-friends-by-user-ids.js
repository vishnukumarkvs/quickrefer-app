import driver from "@/lib/neo4jClient";

export const getFriendsByUserIds = async (userId) => {
  const friendListQuery = `
    MATCH (u:User {userId: $userId})-[r:FRIENDS_WITH]->(f:User)
    RETURN f.userId as userId, f.username as name
  `;
  const result = await driver.session().run(friendListQuery, {
    userId: userId,
  });

  const friends = result.records.map((record) => {
    const userId = record.get("userId");
    const name = record.get("name");
    return { userId, name };
  });

  return friends;
};
