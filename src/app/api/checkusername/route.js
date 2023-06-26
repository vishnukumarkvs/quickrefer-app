import ddbClient from "@/lib/ddbclient";
import { QueryCommand } from "@aws-sdk/client-dynamodb";

export async function POST(req) {
  const { username } = await req.json();

  if (!username) {
    return new Response("Username parameter is required", { status: 400 });
  }

  const params = {
    TableName: "Users",
    IndexName: "jtusername-index",
    KeyConditionExpression: "jtusername = :input",
    ExpressionAttributeValues: {
      ":input": { S: username },
    },
    ProjectionExpression: "jtusername",
  };

  const command = new QueryCommand(params);

  try {
    const data = await ddbClient.send(command);

    if (data.Items && data.Items.length > 0) {
      return new Response(JSON.stringify({ isUsernameTaken: true }), {
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ isUsernameTaken: false }), {
        status: 200,
      });
    }
  } catch (error) {
    console.error("Error querying DynamoDB:", error);
    return new Response("Internal Server error", { status: 500 });
  }
}
