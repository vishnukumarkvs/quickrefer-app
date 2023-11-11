import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import ddbClient from "@/lib/ddbclient";
import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  const { isResume } = await req.json();

  const id = session.user.id;

  try {
    const paramsUpdate = {
      TableName: process.env.DDB_USERS_TABLE,
      Key: {
        pk: { S: `USER#${id}` }, // replace 'userPK' and 'userSK' with actual values
        sk: { S: `USER#${id}` },
      },
      UpdateExpression: "SET isResume = :isResume",
      ExpressionAttributeValues: {
        ":isResume": { BOOL: isResume },
      },
    };

    await ddbClient.send(new UpdateItemCommand(paramsUpdate));
    return new Response("Update Successfull", { status: 200 });
  } catch (err) {
    return new Response(err, { status: 500 });
  }
}
