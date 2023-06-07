import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import client from "@/lib/ddbclient";
import { GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    // Check if user already exists in DynamoDB
    const getUserCommand = new GetItemCommand({
      TableName: "Users",
      Key: {
        email: { S: email },
      },
    });

    const userResult = await client.send(getUserCommand);

    if (userResult.Item) {
      throw new Error("User already exists");
    }

    // Generate a salt and hash the password using bcrypt
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    const id = nanoid();

    const user = {
      id,
      email,
      password: hash,
      salt,
    };

    // Save user to DynamoDB
    const createUserCommand = new PutItemCommand({
      TableName: "Users",
      Item: user,
    });

    try {
      const result = await client.send(createUserCommand);
      console.log("User created successfully:", result);
      // Handle the result accordingly
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
