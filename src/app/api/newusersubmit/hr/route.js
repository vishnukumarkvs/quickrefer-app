import { authOptions } from "@/lib/auth";
import driver from "@/lib/neo4jClient";
import { getServerSession } from "next-auth";
import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import ddbClient from "@/lib/ddbclient";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  const { username, company, linkedin_profile } = await req.json();

  const id = session.user.id;
  const email = session.user.email;

  try {
    const paramsUpdate = {
      TableName: "Users",
      Key: {
        pk: { S: `USER#${id}` }, // replace 'userPK' and 'userSK' with actual values
        sk: { S: `USER#${id}` },
      },
      UpdateExpression:
        "SET jtusername = :jtusernameVal, userRole = :userRoleVal, company = :companyVal",
      ExpressionAttributeValues: {
        ":jtusernameVal": { S: username }, // replace 'newUsername' with the new username
        ":userRoleVal": { S: "HR" },
        ":companyVal": { S: company },
      },
    };

    await ddbClient.send(new UpdateItemCommand(paramsUpdate));
  } catch (err) {
    console.log(err);
    return new Response(err, { status: 500 });
  }

  try {
    const neo4jSession = driver.session({ database: "neo4j" });
    const query = `
        WITH $username AS username, $id AS id, $email AS email, $company AS company, $linkedin_profile AS linkedin_profile, $userRole AS userRole
        MERGE (u:User {userId: $id})
        ON CREATE SET u.username = $username, u.email = $email, u.linkedin_profile = $linkedin_profile, u.userRole = $userRole
        MERGE (c:Company {name: $company})
        MERGE (u)-[:WORKS_AT]->(c)
        `;
    const writeResult = await neo4jSession.executeWrite((tx) =>
      tx.run(query, {
        username: username,
        id: id,
        email: email,
        company: company,
        linkedin_profile: linkedin_profile,
        userRole: "HR",
      })
    );
    await neo4jSession.close();
    return new Response({ status: 201 });
  } catch (err) {
    console.log(err);
    return new Response(err, { status: 500 });
  }
}

//  const query = `
//         WITH $username AS username, $id AS id, $email AS email, $company AS company, $linkedin_profile AS linkedin_profile
//         CREATE (:User {
//         username: $username,
//         id: $id,
//         email: $email,
//         linkedin_profile: $linkedin_profile
//         })
//         MERGE (c:Company {name: $company})
//         MERGE (u:User {id: $id})
//         MERGE (u)-[:WORKS_AT]->(c)
//         `;
