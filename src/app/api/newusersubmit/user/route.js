import { authOptions } from "@/lib/auth";
import driver from "@/lib/neo4jClient";
import { getServerSession } from "next-auth";
import ddbClient from "@/lib/ddbclient";
import s3Client from "@/lib/s3Client";
import { AbortMultipartUploadCommand } from "@aws-sdk/client-s3";
import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  const { username, company, isJobReferrer, skills } = await req.json();
  // console.log("resume", resume);

  const id = session.user.id;
  const email = session.user.email;

  // const params = {
  //   Bucket: "JtResumes",
  //   Key: id,
  //   Body: resume.data, // Set the file data
  // };
  // const command = new AbortMultipartUploadCommand(params);
  // const data = await s3Client.send(command);
  // console.log("data", data);

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
        ":jtusernameVal": { S: username },
        ":userRoleVal": { S: "User" },
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
        MERGE (u:User {userId: $id})
        ON CREATE SET u.username = $username, u.email = $email, u.userRole = $userRole, u.isJobReferrer = $isJobReferrer, u.jobReferralScore = 0
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
        userRole: "User",
        isJobReferrer: isJobReferrer,
        topSkills: skills,
      })
    );

    await neo4jSession.close();
    return new Response({ status: 201 });
  } catch (err) {
    console.log(err);
    return new Response(err, { status: 500 });
  }
}
