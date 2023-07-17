import driver from "@/lib/neo4jClient";

export const getFriendsByUserIds = async (userId) => {
  const friendListQuery = `
    MATCH (u:User {id: $userId})-[r:FRIENDS_WITH]-(f:User)
    RETURN f.id as friendId
  `;
  const result = await driver.session().run(friendListQuery, {
    userId: userId,
  });

  const friendIds = result.records.map((record) => record.get("friendId"));

  const friends = await Promise.all(
    friendIds.map(async (friendId) => {
      const friendQuery = `
        MATCH (u:User {userId: $friendId})
        RETURN u.userId as id, u.username as name
      `;
      const friend = await driver.session().run(friendQuery, {
        friendId: friendId,
      });

      // Extract the friend data from the neo4j result
      const friendData = friend.records[0].get("id");
      const parsedFriend = JSON.parse(friendData);
      console.log("parsedFriend", parsedFriend);
      return parsedFriend;
    })
  );

  return friends;
};
