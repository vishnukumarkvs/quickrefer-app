import { authOptions } from "@/lib/auth";
import driver from "@/lib/neo4jClient";
import { getServerSession } from "next-auth";
import ddbClient from "@/lib/ddbclient";
import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  const { username, company, exp, jobrole } = await req.json();

  const id = session.user.id;
  const email = session.user.email;

  let userRole = "Referrer";

  try {
    const paramsUpdate = {
      TableName: process.env.DDB_USERS_TABLE,
      Key: {
        pk: { S: `USER#${id}` }, // replace 'userPK' and 'userSK' with actual values
        sk: { S: `USER#${id}` },
      },
      UpdateExpression:
        "SET jtusername = :jtusernameVal, userRole = :userRoleVal, company = :companyVal, currentJobRole = :jobroleVal, userNew = :userNewVal",
      ExpressionAttributeValues: {
        ":jtusernameVal": { S: username },
        ":userRoleVal": { S: userRole },
        ":companyVal": { S: company },
        ":jobroleVal": { S: jobrole },
        ":userNewVal": { BOOL: false },
      },
    };

    await ddbClient.send(new UpdateItemCommand(paramsUpdate));
  } catch (err) {
    console.log(err);
    return new Response(err, { status: 500 });
  }

  try {
    const neo4jSession = driver.session({
      database: process.env.NEO4J_DATABASE,
    });
    const query = `
        MERGE (u:User {userId: $id})
        ON CREATE SET u.username = $username, u.email = $email, u.userRole = $userRole, u.AcceptScore = 0, u.experience = $experience, u.fullname = $fullname
        MERGE (c:Company {name: $company})
        MERGE (u)-[:WORKS_AT]->(c)
    `;
    const writeResult = await neo4jSession.executeWrite((tx) =>
      tx.run(query, {
        username: username,
        id: id,
        email: email,
        company: company,
        userRole: userRole,
        experience: exp,
        fullname: fullname,
      })
    );

    await neo4jSession.close();
    return new Response({ status: 201 });
  } catch (err) {
    console.log(err);
    return new Response(err, { status: 500 });
  }
}
