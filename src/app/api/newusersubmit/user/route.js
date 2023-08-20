import { authOptions } from "@/lib/auth";
import driver from "@/lib/neo4jClient";
import { getServerSession } from "next-auth";
import ddbClient from "@/lib/ddbclient";
import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  const { username, company, skills, exp, fullname } = await req.json();

  const id = session.user.id;
  const email = session.user.email;

  let userRole = "Referrer";

  try {
    const paramsUpdate = {
      TableName: "Users",
      Key: {
        pk: { S: `USER#${id}` }, // replace 'userPK' and 'userSK' with actual values
        sk: { S: `USER#${id}` },
      },
      UpdateExpression:
        "SET jtusername = :jtusernameVal, userRole = :userRoleVal, company = :companyVal, fullname = :fullnameVal, userNew = :userNewVal",
      ExpressionAttributeValues: {
        ":jtusernameVal": { S: username },
        ":userRoleVal": { S: userRole },
        ":companyVal": { S: company },
        ":fullnameVal": { S: fullname },
        ":userNewVal": { BOOL: false },
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
        MERGE (u:User {userId: $id})
        ON CREATE SET u.username = $username, u.email = $email, u.userRole = $userRole, u.ReferralScore = 0, u.experience = $experience, u.fullname = $fullname
        MERGE (c:Company {name: $company})
        MERGE (u)-[:WORKS_AT]->(c)
        WITH u
        UNWIND $topSkills AS skill
        MERGE (s:Skill {name: skill})
        MERGE (u)-[:HAS_TOP_SKILL]->(s)
        MERGE (c)-[:HAS_SKILL]->(s)
    `;
    const writeResult = await neo4jSession.executeWrite((tx) =>
      tx.run(query, {
        username: username,
        id: id,
        email: email,
        company: company,
        userRole: userRole,
        topSkills: skills,
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
