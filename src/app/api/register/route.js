import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import ddbClient from "@/lib/ddbclient";
import { QueryCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    // Check if user already exists in DynamoDB
    const params = {
      TableName: "Users",
      IndexName: "GSI1",
      KeyConditionExpression:
        "GSI1PK = :partitionValue AND GSI1SK = :sortValue",
      ExpressionAttributeValues: {
        ":partitionValue": { S: `USER#${email}` },
        ":sortValue": { S: `USER#${email}` },
      },
    };

    const userResult = await ddbClient.send(new QueryCommand(params));

    if (userResult.Items.length > 0) {
      throw new Error("User already exists");
    }

    // Generate a salt and hash the password using bcrypt
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    const id = nanoid();

    const user = {
      pk: `USER#${id}`,
      sk: `USER#${id}`,
      id: id,
      email: email,
      password: hash,
      salt,
      type: "USER",
      GSI1PK: `USER#${email}`,
      GSI1SK: `USER#${email}`,
    };

    // Save user to DynamoDB
    const createUserCommand = new PutItemCommand({
      TableName: "Users",
      Item: marshall(user),
    });

    try {
      const result = await ddbClient.send(createUserCommand);
    } catch (error) {
      console.error("Failed to create user:", error);
      // Handle the error accordingly
      return { statusCode: 500, body: "Failed to create user" };
    }

    return new Response(JSON.stringify(user), { status: 201 });
  } catch (error) {
    console.error("Failed to create user:", error);
    return new Response("Failed to create user", { status: 500 });
  }
}
